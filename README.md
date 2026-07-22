# GestãoPsi

Sistema web de gestão para psicólogos, exportado do Lovable. O projeto oferece autenticação, cadastro de clientes, agenda e prontuário de sessões, anamneses, Rodas da Vida, controle financeiro, relatórios e configurações de perfil.

## Tecnologias

- **TypeScript**, **React 19** e **TanStack Start/Router** para a aplicação web com SSR.
- **Vite 8** para desenvolvimento e build.
- **Tailwind CSS 4**, Radix UI e componentes shadcn/ui para a interface.
- **TanStack Query** para cache e sincronização de dados.
- **React Hook Form** e **Zod** para formulários e validação.
- **Supabase** (PostgreSQL, Auth, Storage e Row Level Security) como backend gerenciado.
- **Recharts**, `html2canvas` e `jsPDF` para gráficos e exportação de PDFs.

## Pré-requisitos

- Node.js 22 LTS (ou uma versão compatível com Vite 8).
- npm 10 ou superior.
- Um projeto Supabase. O arquivo `supabase/migrations/` contém o esquema do banco.

## Executar localmente

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Crie seu arquivo de ambiente a partir do exemplo:

   ```bash
   Copy-Item .env.example .env
   ```

3. Em `.env`, informe a URL e a chave **publishable/anon** do Supabase. Nunca use a `service_role` no navegador.

4. Inicie o servidor:

   ```bash
   npm run dev
   ```

5. Abra a URL mostrada pelo Vite (normalmente `http://localhost:3000`).

## Banco de dados e autenticação

O app usa as tabelas `profiles`, `clients`, `sessions`, `anamnesis`, `wheel_entries` e `transactions`; o avatar é armazenado no bucket `avatars`. As políticas RLS isolam os dados por usuário autenticado.

Para usar um novo projeto Supabase, aplique, em ordem, os arquivos de `supabase/migrations/` pelo Supabase CLI ou SQL Editor. Em seguida:

- habilite Email/Password em **Authentication > Providers** e desative **Confirm email**. Assim, o cadastro da primeira versão já cria uma sessão, sem enviar e-mail de confirmação;
- configure Google OAuth para ativar o botão **Continuar com Google**: em **Authentication > Providers > Google**, habilite o provedor e informe o Client ID e o Client Secret criados no [Google Cloud Console](https://console.cloud.google.com/apis/credentials). No Google Cloud, inclua a URL de callback indicada pelo Supabase (normalmente `https://<project-ref>.supabase.co/auth/v1/callback`) em **Authorized redirect URIs**;
- em **Authentication > URL Configuration**, adicione `http://localhost:3000/dashboard` e a URL de produção seguida de `/dashboard` em **Redirect URLs**;
- aplique também a migração de integridade mais recente; ela cria o bucket privado `avatars`, valida valores financeiros e impede referências a dados de outro psicólogo.

O `.env` exportado pelo Lovable aponta para o projeto Supabase original. Preserve-o apenas na sua máquina; ele agora é ignorado pelo Git. Para compartilhar o código, envie somente `.env.example`.

## Verificação

```bash
npm run lint
npm run build
```

`npm run build` gera a aplicação de produção. Para visualizá-la localmente, use `npm run preview`.

## Estrutura principal

```text
src/routes/                 Páginas e proteção de rotas autenticadas
src/components/             Componentes de interface, financeiro e Rodas da Vida
src/integrations/supabase/  Cliente Supabase, autenticação e tipos do banco
src/lib/                    Utilitários e tratamento de erros
supabase/migrations/        Esquema, RLS, gatilhos e storage do Supabase
```

## Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run lint` | Verifica qualidade e consistência do código. |
| `npm run build` | Gera o build de produção. |
| `npm run preview` | Serve localmente o build de produção. |
| `npm run format` | Formata os arquivos com Prettier. |
