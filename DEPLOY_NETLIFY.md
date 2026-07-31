# 🚀 Guia Completo de Deploy na Netlify — GestãoPsi

Este guia descreve os passos para fazer o deploy do **GestãoPsi** na **Netlify** de forma 100% gratuita e automatizada.

---

## 📋 Passo a Passo

### **1. Conectar a Conta na Netlify**
1. Acesse [app.netlify.com](https://app.netlify.com/)
2. Faça login usando sua conta do **GitHub**.
3. Clique no botão **"Add new site"** → **"Import an existing project"**.
4. Selecione o provedor **GitHub** e escolha o repositório **`Eduardo-Me-llo/GestaoPsi`**.

---

### **2. Configurações de Build (Build Settings)**
Ao importar o projeto, a Netlify preencherá automaticamente as opções. Verifique se estão configuradas assim:

- **Branch to deploy**: `main` (ou `master`)
- **Build command**: `npm run build`
- **Publish directory**: `.netlify/functions-internal` (ou deixe o padrão do Nitro)

---

### **3. Configurar Variáveis de Ambiente (Environment Variables)**
No painel de importação (ou em **Site configuration** > **Environment variables**), adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://fdixndtvdborwgdizgqn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_X1ArgGa46Hkyg13d3oDPqw_aZJiY4M5

SUPABASE_URL=https://fdixndtvdborwgdizgqn.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_X1ArgGa46Hkyg13d3oDPqw_aZJiY4M5
```

*(Opcional - Operações administrativas de Admin)*:
```env
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

---

### **4. Fazer o Deploy**
1. Clique em **"Deploy GestaoPsi"**.
2. Aguarde cerca de 1 a 2 minutos para a compilação finalizar.
3. Sua URL da Netlify estará disponível (ex: `https://gestaopsi.netlify.app`).

---

### **5. Configurar Redirect URLs no Supabase**
Após obter o link da Netlify:
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá em **Authentication** > **URL Configuration** > **Redirect URLs**.
3. Adicione a sua nova URL da Netlify:
   - `https://seu-site.netlify.app/auth/callback`
   - `https://seu-site.netlify.app/dashboard`
   - `https://seu-site.netlify.app`
4. Em **Site URL**, coloque `https://seu-site.netlify.app`.
5. Clique em **Save**.
