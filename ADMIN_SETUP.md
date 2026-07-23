# 🔐 Configuração do Painel Administrativo

## ⚠️ IMPORTANTE: Como Ativar as Funções de Administrador

As funcionalidades administrativas **JÁ ESTÃO IMPLEMENTADAS** no sistema, mas você precisa **promover sua conta a administrador** no banco de dados.

---

## 📋 Passo a Passo

### **1. Criar sua conta no sistema**

1. Acesse seu sistema (local ou deploy)
2. Crie uma conta normalmente pela tela de login
3. Confirme seu e-mail (se necessário)
4. **Anote o e-mail que você usou**

---

### **2. Promover sua conta a Administrador**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto **GestãoPsi**
3. Vá em **SQL Editor**
4. Abra o arquivo `supabase/promote_admin.sql` no seu projeto local
5. **TROQUE** o e-mail no script pelo seu e-mail real:

```sql
-- IMPORTANTE: Troque 'seu-email@example.com' pelo seu e-mail real!
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'seu-email-real@exemplo.com'  -- ⚠️ TROQUE AQUI!
ON CONFLICT (user_id, role) DO NOTHING;
```

6. Cole o script no SQL Editor
7. Clique em **Run** (▶️)
8. Verifique o resultado - deve aparecer: `{admin, psicologo}`

---

### **3. Fazer logout e login novamente**

1. Saia do sistema (logout)
2. Entre novamente com suas credenciais
3. ✅ Pronto! Agora você tem acesso ao painel administrativo

---

## 🎯 Funcionalidades Disponíveis

Após se tornar admin, você terá acesso a:

### **Dashboard Administrativo** (`/admin`)
- Total de psicólogos cadastrados
- Total de clientes na plataforma
- Total de atendimentos realizados
- Quantidade de usuários ativos
- Gráficos de crescimento
- Atividades recentes

### **Gerenciamento de Psicólogos** (`/admin/psicologos`)
- ✅ Listar todos os psicólogos
- ✅ Adicionar novo psicólogo (com senha provisória)
- ✅ Editar dados (nome, CPF, telefone)
- ✅ Ativar/Desativar conta
- ✅ Bloquear/Desbloquear acesso
- ✅ Redefinir senha (direta ou por e-mail)
- ✅ Promover/Remover privilégios de admin
- ✅ Excluir usuário (com confirmação)
- 📊 Ver detalhes e estatísticas

### **Gerenciamento de Clientes** (`/admin/clientes`)
- ✅ Ver todos os clientes da plataforma
- ✅ Filtrar por psicólogo responsável
- ✅ Pesquisar por nome, CPF ou e-mail
- ✅ Ver dados completos de cada cliente
- 📊 Estatísticas por psicólogo

### **Gerenciamento de Usuários** (`/admin/usuarios`)
- ✅ Gerenciar outros administradores
- ✅ Definir níveis de acesso
- ✅ Controle de permissões
- 📊 Registro de último acesso

### **Auditoria** (`/admin/auditoria`)
- 📝 Registro completo de ações no sistema
- 👤 Quem fez cada operação
- ⏰ Data e hora de cada ação
- 🔍 Filtros por usuário, ação e período

### **Configurações Globais** (`/admin/configuracoes`)
- ⚙️ Nome da plataforma
- 🖼️ Logo do sistema
- 📧 Configurações de e-mail
- 🔒 Parâmetros de segurança

---

## ⚠️ Funcionalidades que Requerem Service Role Key

Algumas operações administrativas **exigem** a variável `SUPABASE_SERVICE_ROLE_KEY` configurada:

### **Operações que precisam da chave:**
- ❌ Criar psicólogo diretamente (sem e-mail de confirmação)
- ❌ Definir senha diretamente (sem enviar e-mail)
- ❌ Excluir usuários do sistema

### **Operações que funcionam SEM a chave:**
- ✅ Ativar/Desativar usuários
- ✅ Bloquear/Desbloquear acesso
- ✅ Editar dados de perfil
- ✅ Enviar e-mail de redefinição de senha
- ✅ Visualizar estatísticas e auditoria
- ✅ Gerenciar permissões de admin

**Como configurar:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) → **Settings** → **API**
2. Copie a chave **`service_role`** (secret)
3. Adicione no `.env` (local) ou nas variáveis de ambiente (Vercel):
   ```env
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
   ```

---

## 🔒 Segurança

### **Proteção em Camadas:**

1. **Autenticação:** Usuário precisa estar logado
2. **Verificação de papel:** Sistema verifica se o usuário é admin
3. **RLS (Row Level Security):** Políticas do banco garantem acesso apenas a admins
4. **Server Functions:** Operações privilegiadas só rodam no servidor

### **Boas Práticas:**

- ✅ Nunca compartilhe a `service_role` key
- ✅ Mantenha o número de admins limitado
- ✅ Audite regularmente as ações administrativas
- ✅ Use senhas fortes para contas admin
- ✅ Ative 2FA no Supabase Dashboard

---

## ❓ Troubleshooting

### **"Acesso negado" ao tentar acessar /admin**
**Solução:** Você não foi promovido a admin. Execute o script `promote_admin.sql` no Supabase.

### **Funcionalidades de criar/excluir psicólogo não funcionam**
**Solução:** Configure a variável `SUPABASE_SERVICE_ROLE_KEY`. Use as alternativas (ativar/desativar, enviar e-mail) enquanto não configurar.

### **Não consigo ver outros psicólogos na lista**
**Solução:** Faça logout e login novamente após ser promovido a admin.

### **Erro "função is_admin não existe"**
**Solução:** Execute as migrations do Supabase:
```bash
npx supabase db push
```
Ou aplique manualmente `supabase/migrations/20260722100000_admin_panel.sql` no SQL Editor.

---

## 📚 Próximos Passos

1. ✅ Promover sua conta a admin
2. ✅ Acessar `/admin` para ver o dashboard
3. ✅ Explorar as funcionalidades
4. ⚙️ (Opcional) Configurar `service_role` key para funcionalidades avançadas
5. 👥 (Opcional) Promover outros usuários a admin se necessário

---

**🎉 Pronto! Agora você tem controle total da plataforma.**
