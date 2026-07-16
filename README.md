# GestãoPsi - Sistema de Gestão para Psicólogos

Sistema web completo para psicólogos autônomos gerenciarem clientes, sessões, anamneses, rodas da vida, finanças e relatórios.

## 🚀 Tecnologias

- **Frontend:** React 19 + TypeScript
- **Framework:** TanStack Start (Router + Query)
- **Estilização:** Tailwind CSS v4 + shadcn/ui
- **Autenticação/Banco:** Supabase (PostgreSQL + Auth)
- **Gráficos:** Recharts
- **Formulários:** React Hook Form + Zod
- **PDF:** jsPDF + html2canvas

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- Conta no [Supabase](https://supabase.com) (já configurada)

## 🔧 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd gestaopsi
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   bun install
   ```

3. **Configure as variáveis de ambiente:**
   - O arquivo `.env` já está configurado com as credenciais do Supabase
   - Verifique se as variáveis estão corretas para o seu projeto

## 🏃 Executando Localmente

### 🎯 Método Recomendado: Comandos Manuais

1. **Abra o PowerShell como Administrador**

2. **Navegue até a pasta do projeto:**
   ```powershell
   cd "C:\Users\eduardo.de.mello\Downloads\gestãopsi"
   ```

3. **Verifique se o Node.js está instalado:**
   ```powershell
   node --version
   npm --version
   ```
   - Se mostrar as versões: ótimo!
   - Se não mostrar: instale Node.js 18+ de https://nodejs.org/

4. **Instale as dependências (se ainda não fez):**
   ```powershell
   npm install
   ```

5. **Execute em modo desenvolvimento:**
   ```powershell
   npm run dev
   ```
   OU
   ```powershell
   npm start
   ```

6. **Acesse no navegador:**
   - http://localhost:3000

### ⚡ Método Rápido: Scripts

- **`node-portable.bat`** - ESPECIAL para Node.js portátil (use este!)
- **`node-portable.ps1`** - Versão PowerShell para Node.js portátil
- **`run.cmd`** - Script mais confiável para Windows
- **`start-simple.bat`** - Script simplificado
- **`INSTRUCOES_NODE_PORTATIL.txt`** - Instruções específicas para seu Node.js

### 🔧 Solução de Problemas Comuns

#### Problema: "npm não é reconhecido"
**Solução:**
1. Reinstale o Node.js marcando "Add to PATH"
2. Reinicie o computador

#### Problema: "The directory 'dist' does not exist"
**Solução:** Use `npm run dev` em vez de `npm start`

#### Problema: Erro no PowerShell
**Solução:** Execute os comandos manualmente conforme acima

## 🔗 Configuração do Supabase

O projeto já está configurado com um projeto Supabase existente. As tabelas necessárias são:

- `profiles` - Perfis dos usuários
- `clients` - Clientes/pacientes
- `anamnesis` - Anamneses
- `sessions` - Sessões agendadas
- `transactions` - Transações financeiras
- `wheel_entries` - Rodas da vida

As políticas RLS (Row Level Security) já estão configuradas para garantir que cada usuário só veja seus próprios dados.

## 📁 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── layout/        # Componentes de layout
│   ├── ui/           # Componentes shadcn/ui
│   ├── finance/      # Componentes financeiros
│   └── wheel/        # Componentes da roda da vida
├── hooks/            # Hooks customizados
├── integrations/     # Integrações (Supabase)
├── lib/              # Utilitários
├── routes/           # Rotas (file-based routing)
│   └── _authenticated/ # Rotas protegidas
└── styles.css        # Estilos globais
```

## ✨ Funcionalidades

- ✅ Autenticação com e-mail/senha e Google OAuth
- ✅ CRUD completo de clientes
- ✅ Anamnese com 3 templates (adulto, adolescente, infantil)
- ✅ Roda da vida interativa com exportação PDF
- ✅ Agenda semanal de sessões
- ✅ Gestão financeira (receitas/despesas)
- ✅ Relatórios e gráficos
- ✅ Configurações do profissional
- ✅ Sistema de notificações

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Em caso de problemas:
1. Verifique se o Supabase está ativo
2. Confirme as variáveis de ambiente
3. Execute `npm run lint` para verificar erros de código
4. Consulte as issues no GitHub

---

Desenvolvido com ❤️ para psicólogos autônomos