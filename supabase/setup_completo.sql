-- =============================================================
-- GestãoPsi – Script SQL unificado
-- Cole TODO este conteúdo no SQL Editor do Supabase Dashboard
-- (https://supabase.com/dashboard/project/fdixndtvdborwgdizgqn/sql)
-- e execute uma única vez em um projeto limpo.
-- =============================================================

-- ---------------------------------------------------------------
-- 0. Extensões
-- ---------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.client_status AS ENUM ('ativo','inativo','desistente','alta','espera');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.plan_type AS ENUM ('sessao','mensalidade');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.wheel_type AS ENUM ('adolescente','adulto');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.session_status AS ENUM ('agendada','realizada','faltou','cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.transaction_kind AS ENUM ('receita','despesa');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------
-- 2. Função genérica updated_at
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------
-- 3. Tabela: profiles
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  cpf          TEXT,
  phone        TEXT,
  birth_date   DATE,
  avatar_url   TEXT,
  address      JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_own" ON public.profiles;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-criar profile ao cadastrar usuário
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
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------
-- 4. Tabela: clients
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  social_name   TEXT,
  cpf           TEXT,
  rg            TEXT,
  email         TEXT,
  phone         TEXT,
  gender        TEXT,
  birth_date    DATE,
  notes         TEXT,
  status        public.client_status NOT NULL DEFAULT 'ativo',
  plan_type     public.plan_type     NOT NULL DEFAULT 'sessao',
  session_value NUMERIC(10,2) CHECK (session_value IS NULL OR session_value >= 0),
  group_tag     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients_own" ON public.clients;
CREATE POLICY "clients_own" ON public.clients FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS clients_user_idx ON public.clients(user_id);

DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- 5. Tabela: wheel_entries
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wheel_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id  UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  wheel_type public.wheel_type NOT NULL,
  scores     JSONB NOT NULL,
  notes      TEXT,
  taken_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wheel_entries TO authenticated;
GRANT ALL ON public.wheel_entries TO service_role;
ALTER TABLE public.wheel_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wheel_entries_own" ON public.wheel_entries;
CREATE POLICY "wheel_entries_own" ON public.wheel_entries FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS wheel_entries_client_idx ON public.wheel_entries(client_id, wheel_type, taken_at DESC);

DROP TRIGGER IF EXISTS wheel_entries_updated_at ON public.wheel_entries;
CREATE TRIGGER wheel_entries_updated_at BEFORE UPDATE ON public.wheel_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- 6. Tabela: sessions
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id    UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 50
    CHECK (duration_min BETWEEN 10 AND 480),
  status       public.session_status NOT NULL DEFAULT 'agendada',
  room         TEXT,
  notes        TEXT,
  value        NUMERIC(10,2) CHECK (value IS NULL OR value >= 0),
  paid         BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_own" ON public.sessions;
CREATE POLICY "sessions_own" ON public.sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS sessions_user_scheduled_idx ON public.sessions(user_id, scheduled_at);
CREATE INDEX IF NOT EXISTS sessions_user_status_scheduled_idx ON public.sessions(user_id, status, scheduled_at);
CREATE INDEX IF NOT EXISTS sessions_client_idx ON public.sessions(client_id);

DROP TRIGGER IF EXISTS sessions_set_updated_at ON public.sessions;
CREATE TRIGGER sessions_set_updated_at BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- 7. Tabela: anamnesis
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.anamnesis (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id    UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  template_key TEXT NOT NULL DEFAULT 'adulto',
  data         JSONB NOT NULL DEFAULT '{}'::jsonb,
  filled_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, template_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.anamnesis TO authenticated;
GRANT ALL ON public.anamnesis TO service_role;
ALTER TABLE public.anamnesis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anamnesis_own" ON public.anamnesis;
CREATE POLICY "anamnesis_own" ON public.anamnesis FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS anamnesis_set_updated_at ON public.anamnesis;
CREATE TRIGGER anamnesis_set_updated_at BEFORE UPDATE ON public.anamnesis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- 8. Tabela: transactions
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind        public.transaction_kind NOT NULL,
  category    TEXT,
  description TEXT NOT NULL,
  amount      NUMERIC NOT NULL CHECK (amount > 0),
  due_date    DATE NOT NULL,
  paid_at     DATE,
  client_id   UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  session_id  UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transactions_own" ON public.transactions;
CREATE POLICY "transactions_own" ON public.transactions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS transactions_user_due_idx ON public.transactions(user_id, due_date DESC);
CREATE INDEX IF NOT EXISTS transactions_user_kind_due_idx ON public.transactions(user_id, kind, due_date DESC);

DROP TRIGGER IF EXISTS transactions_set_updated_at ON public.transactions;
CREATE TRIGGER transactions_set_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- 9. Storage: bucket privado avatars
-- ---------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_owner_all" ON storage.objects;
CREATE POLICY "avatars_owner_all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ---------------------------------------------------------------
-- 10. Trigger de integridade referencial por usuário
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_related_record_ownership()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  related_user_id   UUID;
  session_client_id UUID;
BEGIN
  IF TG_TABLE_NAME IN ('sessions', 'anamnesis', 'wheel_entries') THEN
    SELECT user_id INTO related_user_id FROM public.clients WHERE id = NEW.client_id;
    IF related_user_id IS DISTINCT FROM NEW.user_id THEN
      RAISE EXCEPTION 'The related client must belong to the same user' USING ERRCODE = '23514';
    END IF;

  ELSIF TG_TABLE_NAME = 'transactions' THEN
    IF NEW.client_id IS NOT NULL THEN
      SELECT user_id INTO related_user_id FROM public.clients WHERE id = NEW.client_id;
      IF related_user_id IS DISTINCT FROM NEW.user_id THEN
        RAISE EXCEPTION 'The related client must belong to the same user' USING ERRCODE = '23514';
      END IF;
    END IF;

    IF NEW.session_id IS NOT NULL THEN
      SELECT user_id, client_id INTO related_user_id, session_client_id
        FROM public.sessions WHERE id = NEW.session_id;
      IF related_user_id IS DISTINCT FROM NEW.user_id THEN
        RAISE EXCEPTION 'The related session must belong to the same user' USING ERRCODE = '23514';
      END IF;
      IF NEW.client_id IS NOT NULL AND session_client_id IS DISTINCT FROM NEW.client_id THEN
        RAISE EXCEPTION 'The transaction client must match the session client' USING ERRCODE = '23514';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.enforce_related_record_ownership() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS sessions_enforce_related_owner    ON public.sessions;
DROP TRIGGER IF EXISTS anamnesis_enforce_related_owner   ON public.anamnesis;
DROP TRIGGER IF EXISTS wheel_entries_enforce_related_owner ON public.wheel_entries;
DROP TRIGGER IF EXISTS transactions_enforce_related_owner ON public.transactions;

CREATE TRIGGER sessions_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

CREATE TRIGGER anamnesis_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id ON public.anamnesis
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

CREATE TRIGGER wheel_entries_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id ON public.wheel_entries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

CREATE TRIGGER transactions_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id, session_id ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

-- =============================================================
-- Pronto! Todas as tabelas, RLS, triggers e storage criados.
-- =============================================================


-- =============================================================
-- MÓDULO: Painel de Administrador Geral
-- (roles, RLS administrativo, auditoria e configurações globais)
-- =============================================================

-- 1. Enum de papéis
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'psicologo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Tabela de papéis (separada de profiles por segurança)
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

-- 3. Funções de verificação de papel (SECURITY DEFINER evita recursão em RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 4. RLS de user_roles
DROP POLICY IF EXISTS user_roles_read ON public.user_roles;
CREATE POLICY user_roles_read ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS user_roles_admin_write ON public.user_roles;
CREATE POLICY user_roles_admin_write ON public.user_roles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. Flags de conta em profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_active  BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT false;

-- 6. Papel automático 'psicologo' no cadastro (estende handle_new_user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'psicologo')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $$;

-- 7. Políticas RLS de acesso global para o ADMIN
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

-- 8. Auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action      TEXT NOT NULL,
  entity      TEXT,
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

DROP POLICY IF EXISTS audit_insert_own ON public.audit_logs;
CREATE POLICY audit_insert_own ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
DROP POLICY IF EXISTS audit_admin_read ON public.audit_logs;
CREATE POLICY audit_admin_read ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_action TEXT; v_id TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN v_action := 'insert'; v_id := NEW.id::text;
  ELSIF TG_OP = 'UPDATE' THEN v_action := 'update'; v_id := NEW.id::text;
  ELSIF TG_OP = 'DELETE' THEN v_action := 'delete'; v_id := OLD.id::text;
  END IF;
  INSERT INTO public.audit_logs (user_id, action, entity, entity_id)
  VALUES (auth.uid(), v_action, TG_TABLE_NAME, v_id);
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.log_audit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS clients_audit ON public.clients;
CREATE TRIGGER clients_audit AFTER INSERT OR UPDATE OR DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
DROP TRIGGER IF EXISTS sessions_audit ON public.sessions;
CREATE TRIGGER sessions_audit AFTER INSERT OR UPDATE OR DELETE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
DROP TRIGGER IF EXISTS transactions_audit ON public.transactions;
CREATE TRIGGER transactions_audit AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
DROP TRIGGER IF EXISTS anamnesis_audit ON public.anamnesis;
CREATE TRIGGER anamnesis_audit AFTER INSERT OR UPDATE OR DELETE ON public.anamnesis
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

-- 9. Configurações globais do sistema (singleton)
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
GRANT SELECT, INSERT, UPDATE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS system_settings_read ON public.system_settings;
CREATE POLICY system_settings_read ON public.system_settings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS system_settings_admin_write ON public.system_settings;
CREATE POLICY system_settings_admin_write ON public.system_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP TRIGGER IF EXISTS system_settings_updated_at ON public.system_settings;
CREATE TRIGGER system_settings_updated_at BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.system_settings (id) VALUES (true) ON CONFLICT DO NOTHING;

-- 10. View: psicólogos (gated por is_admin)
CREATE OR REPLACE VIEW public.admin_psychologists AS
SELECT p.id, p.full_name, p.cpf, p.phone, p.is_active, p.is_blocked, p.created_at,
       u.email, u.last_sign_in_at,
       (SELECT COUNT(*) FROM public.clients c WHERE c.user_id = p.id) AS client_count
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE public.has_role(p.id, 'psicologo') AND public.is_admin();
GRANT SELECT ON public.admin_psychologists TO authenticated;

-- 11. View: clientes globais (gated por is_admin)
CREATE OR REPLACE VIEW public.admin_clients AS
SELECT c.id, c.full_name, c.cpf, c.email, c.phone, c.status, c.created_at,
       c.user_id AS psychologist_id, p.full_name AS psychologist_name
FROM public.clients c
JOIN public.profiles p ON p.id = c.user_id
WHERE public.is_admin();
GRANT SELECT ON public.admin_clients TO authenticated;

-- 12. View: administradores (gated por is_admin)
CREATE OR REPLACE VIEW public.admin_users AS
SELECT p.id, p.full_name, p.is_active, p.is_blocked, p.created_at,
       u.email, u.last_sign_in_at,
       ARRAY(SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.id ORDER BY ur.role) AS roles
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE public.has_role(p.id, 'admin') AND public.is_admin();
GRANT SELECT ON public.admin_users TO authenticated;

-- =============================================================
-- BOOTSTRAP DO PRIMEIRO ADMINISTRADOR
-- Após criar sua conta pelo app, rode UMA vez com seu e-mail:
--
--   INSERT INTO public.user_roles (user_id, role)
--   SELECT id, 'admin' FROM auth.users WHERE email = 'seu-email@exemplo.com'
--   ON CONFLICT (user_id, role) DO NOTHING;
-- =============================================================
