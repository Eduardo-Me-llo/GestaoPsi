# 🚀 Guia Completo de Deploy na Vercel

Este documento contém o passo a passo completo para fazer deploy do **GestãoPsi** na Vercel.

## ✅ Pré-requisitos

- ✅ Código já está no GitHub (`Eduardo-Me-llo/GestaoPsi`)
- ✅ Conta no [Vercel](https://vercel.com)
- ✅ Conta no Supabase configurada
- ✅ Arquivos `vercel.json` e `nitro.config.ts` criados (já estão no projeto)

---

## 📋 Passo a Passo

### **1. Preparar o Projeto**

O projeto já está configurado! Os arquivos necessários:
- ✅ `vercel.json` - Define build command e output
- ✅ `nitro.config.ts` - Configura preset Vercel para o Nitro

**Nenhuma alteração de código é necessária!**

---

### **2. Conectar à Vercel**

1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório **`Eduardo-Me-llo/GestaoPsi`**
5. Clique em **"Import"**

---

### **3. Configurar Variáveis de Ambiente**

Na página de configuração do projeto, adicione as seguintes **Environment Variables**:

#### **Variáveis Obrigatórias:**

```env
VITE_SUPABASE_URL=https://fdixndtvdborwgdizgqn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkaXhuZHR2ZGJvcndnZGl6Z3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzQ0MjIsImV4cCI6MjA1MzQxMDQyMn0.X1ArgGa46Hkyg13d3oDPqw_aZJiY4M5

SUPABASE_URL=https://fdixndtvdborwgdizgqn.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkaXhuZHR2ZGJvcndnZGl6Z3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzQ0MjIsImV4cCI6MjA1MzQxMDQyMn0.X1ArgGa46Hkyg13d3oDPqw_aZJiY4M5
```

#### **Variáveis Opcionais (Funcionalidades Admin):**

```env
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

**⚠️ Como obter a Service Role Key:**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o projeto **GestãoPsi**
3. Vá em **Settings** → **API**
4. Copie a chave **`service_role`** (secret)

**Para que serve:**
- Criar psicólogos diretamente (sem e-mail de confirmação)
- Excluir usuários
- Redefinir senha diretamente
- Operações administrativas que exigem privilégios elevados

**⚠️ IMPORTANTE:** Esta chave é **secreta** e não deve ser exposta no frontend. Ela só é usada em funções do servidor.

---

### **4. Fazer o Deploy**

Após configurar as variáveis:
1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. ✅ Seu site estará online!

A URL será algo como: `https://gestao-psi.vercel.app`

---

### **5. Configurar Autenticação no Supabase**

Após o primeiro deploy, você precisa adicionar a URL da Vercel nas configurações do Supabase:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** → **URL Configuration**
4. Adicione as seguintes URLs em **"Redirect URLs"**:

```
https://seu-projeto.vercel.app/auth/callback
https://seu-projeto.vercel.app/dashboard
https://seu-projeto.vercel.app
```

5. Em **"Site URL"**, defina:
```
https://seu-projeto.vercel.app
```

6. Clique em **Save**

---

### **6. Configurar Autenticação Google (Opcional)**

Se você usa login com Google:

1. No Supabase Dashboard → **Authentication** → **Providers**
2. Configure o **Google Provider**
3. Nas configurações do Google Cloud Console:
   - Adicione a URL da Vercel em **"Authorized JavaScript origins"**
   - Adicione `https://seu-projeto.vercel.app/auth/callback` em **"Authorized redirect URIs"**

---

## 🔄 Atualizações Automáticas

Toda vez que você fizer `git push` para a branch **main/master**:
- ✅ Vercel detecta automaticamente
- ✅ Faz o build
- ✅ Deploy automático
- ✅ Zero downtime

---

## 📊 Monitoramento

Acesse o dashboard da Vercel para ver:
- Logs de build
- Logs de runtime
- Analytics
- Métricas de performance

---

## 🐛 Troubleshooting

### **Erro: "Build failed"**
- Verifique se todas as dependências estão no `package.json`
- Veja os logs de build no dashboard da Vercel

### **Erro: "Cannot connect to Supabase"**
- Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` estão corretas
- Lembre-se: variáveis com prefixo `VITE_` são expostas no frontend

### **Erro: "Authentication redirect failed"**
- Verifique se adicionou a URL da Vercel nas **Redirect URLs** do Supabase
- Aguarde alguns minutos para as mudanças propagarem

### **Funcionalidades admin não funcionam**
- Adicione a variável `SUPABASE_SERVICE_ROLE_KEY`
- Esta variável é **opcional**, mas necessária para:
  - Criar psicólogos diretamente
  - Excluir usuários
  - Redefinir senha sem e-mail

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Deploy na Vercel concluído com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Redirect URLs adicionadas no Supabase
- [ ] Autenticação funcionando (teste login)
- [ ] CRUD de clientes funcionando
- [ ] Painel administrativo acessível
- [ ] (Opcional) Service role key configurada
- [ ] (Opcional) Google OAuth configurado

---

## 🎯 Próximos Passos (Pós-Deploy)

1. **Domínio Personalizado** (Opcional)
   - Na Vercel: Settings → Domains
   - Adicione seu domínio customizado
   - Configure DNS conforme instruções

2. **SSL/HTTPS**
   - ✅ Automático pela Vercel
   - Certificado gerenciado automaticamente

3. **Backups**
   - Supabase faz backup automático
   - Configure Point-in-Time Recovery se necessário

---

## 🆘 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **TanStack Start**: https://tanstack.com/start
- **Supabase Docs**: https://supabase.com/docs

---

**✨ Pronto! Seu sistema está no ar!**
