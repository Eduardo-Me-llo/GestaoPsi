# Instalação no Windows

Para executar o GestãoPsi localmente no Windows, siga estas instruções:

## 🎯 Pré-requisitos

### 1. Instalar Node.js
1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (20.x ou superior)
3. Execute o instalador
4. Marque a opção "Add to PATH" durante a instalação
5. Após instalar, abra um novo PowerShell ou Prompt de Comando

### 2. Verificar a instalação
```powershell
node --version
npm --version
```

## 📦 Instalar Dependências do Projeto

1. Abra o PowerShell como Administrador
2. Navegue até a pasta do projeto:
```powershell
cd "C:\Users\eduardo.de.mello\Downloads\gestãopsi"
```

3. Instale as dependências:
```powershell
npm install
```

## 🔧 Configuração do Ambiente

O projeto já está configurado com:
- ✅ Configurações do Supabase no arquivo `.env`
- ✅ Vite configurado para desenvolvimento local
- ✅ Scripts npm prontos para uso

## 🚀 Executar o Projeto

### Modo Desenvolvimento:
```powershell
npm run dev
```

O aplicativo estará disponível em: [http://localhost:3000](http://localhost:3000)

### Build para Produção:
```powershell
npm run build
npm run preview
```

## 🔍 Solução de Problemas Comuns

### 1. Erro "command not found"
- Verifique se Node.js está instalado corretamente
- Feche e reabra o terminal após instalar Node.js
- Execute `refreshenv` no PowerShell para atualizar as variáveis de ambiente

### 2. Erros de dependência
```powershell
# Limpar cache e reinstalar
npm cache clean --force
rmdir node_modules /s /q
npm install
```

### 3. Problemas com o Supabase
- Verifique se o arquivo `.env` contém as credenciais corretas
- Confirme se o projeto Supabase está ativo em https://supabase.com
- As tabelas necessárias já estão configuradas nas migrations

## 🌐 Testar a Aplicação

Após executar `npm run dev`:
1. Abra o navegador em http://localhost:3000
2. Crie uma conta ou faça login
3. Teste as funcionalidades:
   - Cadastro de clientes
   - Agenda de sessões
   - Roda da vida
   - Relatórios financeiros

## 📁 Estrutura para GitHub

O projeto está pronto para ser enviado para GitHub:
- `.gitignore` configurado
- `README.md` com instruções
- Dependências atualizadas
- Sem referências ao Lovable

Para enviar para GitHub:
```powershell
git init
git add .
git commit -m "Initial commit - GestãoPsi"
# Crie um repositório no GitHub e siga as instruções para fazer push
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no terminal
2. Confirme as credenciais do Supabase
3. Consulte o arquivo `SISTEMA_CONTEXT.md` para detalhes técnicos

---

**O projeto está totalmente funcional e pronto para uso local!** 🎉