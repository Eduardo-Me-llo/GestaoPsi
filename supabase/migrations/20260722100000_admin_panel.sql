-- =============================================================
-- Painel de Administrador Geral (Desenvolvedor)
-- Roles, RLS administrativo, auditoria e configurações globais.
--
-- Boas práticas aplicadas:
--  - Roles em tabela separada (user_roles), nunca em profiles,
--    para evitar escalação de privilégio via UPDATE do próprio perfil.
--  - has_role()/is_admin() como SECURITY DEFINER (evita recursão em RLS).
--  - Políticas RLS dão acesso global ao admin, mantendo o isolamento
--    por usuário para o psicólogo comum.
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Enum de papéis
-- ---------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'psicologo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------
-- 2. Tabela de papéis (separada de profiles por segurança)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS user_roles_user_idx ON public.user_roles(user_id);

-- ---------------------------------------------------------------
-- 3. Funções de verificação de papel (SECURITY DEFINER)
--    O SECURITY DEFINER faz a leitura ignorar RLS, evitando
--    recursão infinita nas políticas que chamam is_admin().
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Concede execução às roles do PostgREST
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ---------------------------------------------------------------
-- 4. RLS de user_roles
--    - O usuário lê os próprios papéis.
--    - O admin lê e gerencia todos.
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS user_roles_read ON public.user_roles;
CREATE POLICY user_roles_read ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS user_roles_admin_write ON public.user_roles;
CREATE POLICY user_roles_admin_write ON public.user_roles FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------
-- 5. Flags de conta em profiles
-- ---------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_active  BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------
-- 6. Papel automático 'psicologo' no cadastro
--    (estende a função existente handle_new_user)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.email
    )
  )
  ON CONFLICT (id) DO NOTHING;

  -- Todo novo usuário nasce como psicólogo. O admin é promovido manualmente.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'psicologo')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $$;

-- ---------------------------------------------------------------
-- 7. Políticas RLS de acesso global para o ADMIN
--    O psicólogo continua restrito às próprias linhas (políticas
--    *_own já existentes); estas apenas ADICIONAM acesso ao admin.
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS profiles_admin_all ON public.profiles;
CREATE POLICY profiles_admin_all ON public.profiles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS clients_admin_all ON public.clients;
CREATE POLICY clients_admin_all ON public.clients FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS sessions_admin_all ON public.sessions;
CREATE POLICY sessions_admin_all ON public.sessions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS transactions_admin_all ON public.transactions;
CREATE POLICY transactions_admin_all ON public.transactions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS anamnesis_admin_all ON public.anamnesis;
CREATE POLICY anamnesis_admin_all ON public.anamnesis FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS wheel_entries_admin_all ON public.wheel_entries;
CREATE POLICY wheel_entries_admin_all ON public.wheel_entries FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------
-- 8. Auditoria
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action      TEXT NOT NULL,          -- login, logout, insert, update, delete...
  entity      TEXT,                   -- nome da tabela/entidade afetada
  entity_id   TEXT,
  details     JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON public.audit_logs(user_id, created_at DESC);

-- Cada usuário registra as próprias ações; o admin lê tudo.
DROP POLICY IF EXISTS audit_insert_own ON public.audit_logs;
CREATE POLICY audit_insert_own ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS audit_admin_read ON public.audit_logs;
CREATE POLICY audit_admin_read ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin());

-- Trigger genérico de auditoria para as tabelas de negócio
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_action TEXT;
  v_id     TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'insert'; v_id := NEW.id::text;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update'; v_id := NEW.id::text;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete'; v_id := OLD.id::text;
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity, entity_id)
  VALUES (auth.uid(), v_action, TG_TABLE_NAME, v_id);

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.log_audit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS clients_audit ON public.clients;
CREATE TRIGGER clients_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

DROP TRIGGER IF EXISTS sessions_audit ON public.sessions;
CREATE TRIGGER sessions_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

DROP TRIGGER IF EXISTS transactions_audit ON public.transactions;
CREATE TRIGGER transactions_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

DROP TRIGGER IF EXISTS anamnesis_audit ON public.anamnesis;
CREATE TRIGGER anamnesis_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.anamnesis
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

-- ---------------------------------------------------------------
-- 9. Configurações globais do sistema (linha única / singleton)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
  id                 BOOLEAN PRIMARY KEY DEFAULT true,
  platform_name      TEXT NOT NULL DEFAULT 'GestãoPsi',
  logo_url           TEXT,
  institutional_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  auth_settings      JSONB NOT NULL DEFAULT '{}'::jsonb,
  email_settings     JSONB NOT NULL DEFAULT '{}'::jsonb,
  general_params     JSONB NOT NULL DEFAULT '{}'::jsonb,
  security_settings  JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT system_settings_singleton CHECK (id)
);

GRANT SELECT ON public.system_settings TO authenticated;
GRANT INSERT, UPDATE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Leitura liberada (nome/logo aparecem para todos); escrita só admin.
DROP POLICY IF EXISTS system_settings_read ON public.system_settings;
CREATE POLICY system_settings_read ON public.system_settings FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS system_settings_admin_write ON public.system_settings;
CREATE POLICY system_settings_admin_write ON public.system_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS system_settings_updated_at ON public.system_settings;
CREATE TRIGGER system_settings_updated_at BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.system_settings (id) VALUES (true) ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 10. Visão consolidada de psicólogos para o admin
--     Junta profiles + papel + contagem de clientes.
-- ---------------------------------------------------------------
CREATE OR REPLACE VIEW public.admin_psychologists AS
SELECT
  p.id,
  p.full_name,
  p.cpf,
  p.phone,
  p.is_active,
  p.is_blocked,
  p.created_at,
  u.email,
  u.last_sign_in_at,
  (SELECT COUNT(*) FROM public.clients c WHERE c.user_id = p.id) AS client_count
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
-- O filtro is_admin() é ESSENCIAL: a view roda com privilégios do dono e
-- ignora a RLS das tabelas base. Sem este filtro, qualquer usuário
-- autenticado poderia ler e-mails de todos. Com ele, não-admins veem 0 linhas.
WHERE public.has_role(p.id, 'psicologo')
  AND public.is_admin();

GRANT SELECT ON public.admin_psychologists TO authenticated;

-- ---------------------------------------------------------------
-- 11. Visão global de clientes para o admin
--     Junta cada cliente ao psicólogo responsável.
-- ---------------------------------------------------------------
CREATE OR REPLACE VIEW public.admin_clients AS
SELECT
  c.id,
  c.full_name,
  c.cpf,
  c.email,
  c.phone,
  c.status,
  c.created_at,
  c.user_id            AS psychologist_id,
  p.full_name          AS psychologist_name
FROM public.clients c
JOIN public.profiles p ON p.id = c.user_id
-- Mesma proteção da view de psicólogos: só admin enxerga linhas.
WHERE public.is_admin();

GRANT SELECT ON public.admin_clients TO authenticated;

-- ---------------------------------------------------------------
-- 12. Visão dos administradores da plataforma
-- ---------------------------------------------------------------
CREATE OR REPLACE VIEW public.admin_users AS
SELECT
  p.id,
  p.full_name,
  p.is_active,
  p.is_blocked,
  p.created_at,
  u.email,
  u.last_sign_in_at,
  ARRAY(
    SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.id ORDER BY ur.role
  ) AS roles
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE public.has_role(p.id, 'admin')
  AND public.is_admin();

GRANT SELECT ON public.admin_users TO authenticated;

-- =============================================================
-- BOOTSTRAP DO PRIMEIRO ADMINISTRADOR
-- Após criar sua conta normalmente pelo app, rode UMA vez,
-- trocando o e-mail pelo seu:
--
--   INSERT INTO public.user_roles (user_id, role)
--   SELECT id, 'admin' FROM auth.users WHERE email = 'seu-email@exemplo.com'
--   ON CONFLICT (user_id, role) DO NOTHING;
-- =============================================================
