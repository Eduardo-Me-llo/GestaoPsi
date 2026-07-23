-- =============================================================
-- Script para Promover Usuário a Administrador
-- =============================================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Cole este script
-- 4. TROQUE o e-mail abaixo pelo seu e-mail de login
-- 5. Execute (Run)
--
-- Após executar, faça logout e login novamente no sistema.
-- =============================================================

-- IMPORTANTE: Troque 'seu-email@example.com' pelo seu e-mail real!
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'seu-email@example.com'  -- ⚠️ TROQUE AQUI!
ON CONFLICT (user_id, role) DO NOTHING;

-- Verificar se funcionou:
SELECT 
  u.email,
  ARRAY_AGG(ur.role::text) as roles
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'seu-email@example.com'  -- ⚠️ TROQUE AQUI!
GROUP BY u.email;

-- Resultado esperado: uma linha com roles = {admin, psicologo}
