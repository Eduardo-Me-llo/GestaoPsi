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
-- Exemplo para edumello1001@gmail.com:
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'edumello1001@gmail.com'  -- ⚠️ TROQUE AQUI SE NECESSÁRIO!
ON CONFLICT (user_id, role) DO NOTHING;

-- Verificar se funcionou:
SELECT 
  u.email,
  u.id as user_id,
  ARRAY_AGG(ur.role::text) as roles,
  p.full_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'edumello1001@gmail.com'  -- ⚠️ TROQUE AQUI SE NECESSÁRIO!
GROUP BY u.email, u.id, p.full_name;

-- Resultado esperado: uma linha com roles = {admin, psicologo}
-- Se aparecer só {psicologo} ou NULL, o INSERT não funcionou

