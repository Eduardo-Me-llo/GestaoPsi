# Contexto Geral do Sistema — GestãoPsi

## 1. Visão Geral

GestãoPsi é um sistema web de gestão clínica para psicólogos autônomos. Foi desenvolvido com foco em simplicidade, segurança e mobilidade. Permite gerenciar pacientes, sessões, anamneses, rodas da vida (adulto e adolescente), finanças, relatórios e configurações pessoais do profissional.

## 2. Stack Tecnológico

- **Framework full-stack:** TanStack Start v1 (React 19 + SSR/SSG + Vite 7)
- **Roteamento:** file-based routing (`src/routes/`)
- **Estilização:** Tailwind CSS v4 via `src/styles.css`
- **Componentes UI:** shadcn/ui (Button, Card, Dialog, Input, Label, Select, Switch, Tabs, Calendar, Popover, etc.)
- **Backend/Auth/Banco:** Supabase — Postgres, Auth, Row Level Security (RLS), Storage
- **Cliente Supabase:** `@supabase/supabase-js` com clientes separados para browser e server
- **Query/Cache:** TanStack Query
- **Gráficos:** Recharts
- **PDF:** jspdf + html2canvas
- **Notificações UI:** sonner
- **Ícones:** lucide-react
- **Linguagem:** TypeScript strict

## 3. Estrutura de Pastas Relevante

```
src/
  components/
    layout/
      AppShell.tsx          # Layout autenticado (sidebar + header + sino + avatar)
      NotificationBell.tsx  # Centro de notificações do profissional
    wheel/
      WheelOfLifeSVG.tsx    # Renderização SVG da roda da vida
      WheelEditor.tsx       # Editor interativo + exportação PDF
      axes.ts               # Definição dos eixos adulto e adolescente
    finance/
      TransactionsPage.tsx  # CRUD de receitas/despesas
    ui/                     # shadcn/ui
  lib/
    user-settings.ts        # Utilitários de preferências do usuário (agenda, notificações, avatar)
  routes/
    __root.tsx              # Shell raiz, metadados, fontes, auth listener
    index.tsx               # Landing / redirecionamento
    auth.tsx                # Login/cadastro
    reset-password.tsx      # Redefinição de senha
    _authenticated/
      route.tsx             # Gate de autenticação
      dashboard.tsx         # Painel inicial (pode ser removido — confuso)
      clientes.tsx          # Layout da área de clientes
      clientes.index.tsx    # Lista de clientes + novo cadastro
      clientes.$id.tsx     # Detalhes do cliente com abas
      clientes.$id.index.tsx # Perfil do cliente + edição/exclusão
      clientes.$id.anamnese.tsx # Anamnese com 3 templates
      clientes.$id.roda-adulto.tsx
      clientes.$id.roda-adolescente.tsx
      agenda.tsx            # Agenda semanal com sessões
      financeiro.tsx        # Layout financeiro
      financeiro.index.tsx  # Dashboard financeiro
      financeiro.receitas.tsx
      financeiro.despesas.tsx
      financeiro.fluxo-caixa.tsx
      relatorios.tsx        # Relatórios e indicadores
      configuracoes.tsx     # Configurações do profissional
  integrations/supabase/
    client.ts               # Cliente browser (não editar)
    client.server.ts        # Cliente service-role (admin)
    auth-middleware.ts      # Middleware requireSupabaseAuth
    auth-attacher.ts        # Anexa bearer token em server functions
    types.ts                # Tipos gerados do banco
  start.ts                  # Configuração de middlewares
  styles.css                # Tema Tailwind v4
```

## 4. Banco de Dados (Supabase)

Todas as tabelas estão no schema `public`, com `GRANT` explícito e RLS ativado. As políticas garantem que cada usuário autenticado só veja seus próprios dados.

### Tabelas principais

- `profiles`
  - `id` (uuid, FK auth.users)
  - `full_name`, `phone`, `birth_date`, `avatar_url`
  - `address` (jsonb) — usado como armazenamento de preferências: `bio`, `agenda`, `notifications`, `avatar_path`

- `clients`
  - `id`, `user_id`, `full_name`, `social_name`, `status`, `plan_type`
  - `session_value`, `birth_date`, `gender`, `phone`, `email`, `notes`, `group_tag`

- `anamnesis`
  - `id`, `user_id`, `client_id`, `template_key` (adulto/adolescente/infantil)
  - `data` (jsonb), `filled_at`

- `wheel_entries`
  - `id`, `user_id`, `client_id`, `wheel_type`, `scores` (jsonb), `notes`, `taken_at`

- `sessions`
  - `id`, `user_id`, `client_id`, `scheduled_at`, `duration_min`, `status`
  - `value`, `room`, `notes`, `paid`

- `transactions`
  - `id`, `user_id`, `client_id`, `session_id`, `kind` (receita/despesa)
  - `amount`, `description`, `category`, `due_date`, `paid_at`, `notes`

## 5. Funcionalidades Implementadas

### Autenticação
- Cadastro/login com e-mail/senha.
- Login social via Google OAuth.
- Redefinição de senha por e-mail.
- Proteção de rotas autenticadas via `_authenticated/route.tsx`.

### Clientes
- CRUD completo de pacientes.
- Campos: nome social, dados pessoais, valor da sessão, plano, status, observações.
- Aba de perfil do cliente com edição e exclusão.
- Agrupamento por `group_tag` (campo livre).

### Anamnese
- 3 templates: Adulto, Adolescente, Infantil.
- Campos em `textarea` organizados por seções.
- Persistência em JSONB na tabela `anamnesis`.
- Chave de conflito: `client_id, template_key` (um registro por cliente/template).

### Roda da Vida
- Dois tipos: Adulto (8 eixos) e Adolescente (8 eixos).
- Editor interativo com slider por eixo.
- Visualização em SVG poligonal.
- Histórico de aplicações.
- Exportação para PDF.

### Agenda
- Visão semanal (domingo a sábado).
- Navegação por semanas.
- Sessões coloridas por status: agendada, realizada, faltou, cancelada.
- Dialog para criar/editar sessões vinculadas a cliente.
- Configurações dinâmicas: horário de início/fim, duração padrão, dias ocultos.

### Financeiro
- Dashboard com saldo, a receber, despesas e gráfico anual.
- CRUD de receitas e despesas.
- Categorização manual.
- Vínculo opcional com cliente e sessão.
- Fluxo de caixa mensal com saldo acumulado.
- Status de pagamento (pago/pendente) e data de vencimento.

### Relatórios
- Indicadores clínicos: total de clientes, sessões, taxa de comparecimento, inadimplência.
- Gráficos de gênero, faixa etária e status dos clientes.
- Dados calculados no client a partir das tabelas `clients`, `sessions` e `transactions`.

### Configurações
- Perfil profissional: nome, telefone, data de nascimento, bio.
- Upload de foto de perfil (bucket privado `avatars` + signed URLs).
- Configurações de agenda: horário de início/fim, duração padrão, dias ocultos.
- Preferências de notificações: lembretes de sessões, alertas financeiros.
- Alteração de senha e logout.

### Notificações
- Sino no cabeçalho direito (`NotificationBell`).
- Lista de sessões nas próximas 48h.
- Transações pendentes/vencidas nos próximos 7 dias.
- Badge com contador de itens pendentes.

## 6. Regras de Segurança Importantes

- Toda tabela pública tem `GRANT` e RLS.
- `user_id` é sempre o `auth.uid()` do usuário logado.
- Bucket de avatares é privado; acesso via signed URL de 1h.
- Não use `supabaseAdmin` para lógica comum do app; só para webhooks/admin.
- Nunca armazene roles no `profiles` ou `users`.
- `process.env.*` só existe no server; no client usar `import.meta.env.VITE_*`.
- Server functions com `requireSupabaseAuth` precisam do `attachSupabaseAuth` registrado em `start.ts`.

## 7. Decisões de Design

- Tema escuro com acento azul (`primary: #3B82F6`).
- Fontes: Plus Jakarta Sans (títulos) e Inter (corpo).
- Mobile-first, layout com sidebar responsiva.
- OKLCH no Tailwind v4.

## 8. Pontos de Atenção para Outra IA

- **Não crie `src/pages/`** — o roteamento é file-based em `src/routes/`.
- **Não edite `src/routeTree.gen.ts`** — ele é gerado automaticamente.
- **Não edite arquivos em `src/integrations/supabase/`** — são auto-gerados, exceto se necessário forçar.
- **Toda nova tabela precisa de GRANT + RLS** na mesma migração.
- **Server functions protegidas** devem ser chamadas de componentes, nunca de loaders de rotas públicas.
- **Preferências do usuário** estão em `profiles.address` (JSONB), não em tabela separada.
- **Imagens de perfil** usam bucket `avatars` privado; obter URL assinada via `supabase.storage.from('avatars').createSignedUrl(path, 3600)`.
- O `dashboard` existe mas foi considerado confuso; evite reintroduzí-lo sem conversar com o usuário.

---

# Futuras Melhorias Sugeridas

## Curto prazo (fácil implementação)

1. **Prontuário / evolução por sessão**
   - Tabela `session_notes` vinculada a `sessions`.
   - Campo para anotações clínicas e plano de ação pós-sessão.

2. **Upload de documentos do paciente**
   - Bucket privado `documents`.
   - Vincular arquivos ao `client_id` e `user_id`.
   - Permite anexar laudos, receitas, termos de consentimento.

3. **Histórico de evolução da Roda da Vida**
   - Gráfico comparativo entre duas aplicações (antes/depois).
   - Ajuda a visualizar progresso terapêutico.

4. **Lembretes por e-mail/WhatsApp**
   - Integração com serviço de envio (SendGrid, Twilio, etc.).
   - Lembrete automático 24h antes da sessão.
   - Confirmação de presença via link.

5. **Filtros e busca na lista de clientes**
   - Busca por nome, e-mail, telefone.
   - Filtros por status, plano, gênero, faixa etária.

6. **Campos customizados do paciente**
   - Permitir que o psicólogo adicione campos extras ao perfil do cliente.

## Médio prazo (esforço moderado)

7. **Faturamento e recibos**
   - Geração de recibo em PDF por sessão paga.
   - Controle de número de recibo e configuração de CNPJ/CPF do profissional.

8. **Integração bancária/pagamento**
   - Stripe ou Pix para cobrança automática.
   - Vinculação de pagamento com sessão/transaction.

9. **Agenda com recorrência**
   - Sessões semanais recorrentes (toda terça, por exemplo).
   - Tabela auxiliar `session_recurrences`.

10. **Dashboard de acompanhamento clínico**
    - Evolução de humor/ansiedade ao longo do tempo (escala simples por sessão).
    - Gráficos de progresso individual por cliente.

11. **Backup e exportação de dados**
    - Exportar clientes, sessões e financeiro para CSV/Excel.
    - Exportar prontuário completo do paciente em PDF.

12. **Multiplos locais de atendimento**
    - Campo `location` na sessão.
    - Configuração de salas/consultórios nas preferências.

## Longo prazo (maior arquitetura)

13. **Multi-profissional (clínica)**
    - Tabela `clinics` e `professionals`.
    - Roles (`admin`, `recepcionista`, `psicólogo`) via `user_roles`.
    - Acesso compartilhado de clientes por permissão.

14. **Portal do paciente**
    - Login próprio do paciente.
    - Visualização de próximas sessões, pagamentos pendentes e histórico de rodas da vida.
    - Termos de consentimento digital assinados.

15. **Teleatendimento integrado**
    - Link de vídeo gerado por sessão (Jitsi, Daily.co, Meet).
    - Sala virtual dentro do sistema.

16. **Prescrição/encaminhamento digital**
    - Modelos de documentos editáveis.
    - Assinatura digital simples.

17. **Assistente de IA para anamnese**
    - Sugestões de perguntas baseadas na queixa principal.
    - Resumo automatizado do prontuário (usando Lovable AI Gateway).

18. **Integração com planos de saúde**
    - Controle de guias TISS, sessões autorizadas, reembolsos.

19. **Aplicativo móvel (PWA)**
    - Service worker, manifesto, notificações push.
    - Experiência nativa em Android/iOS.

20. **LGPD / compliance**
    - Termo de consentimento com checkbox de aceite.
    - Log de acessos e ações sensíveis.
    - Fluxo de anonimização/exclusão de dados do paciente.

---

## Recomendação de priorização

Sugiro seguir nesta ordem para maximizar o valor clínico:


1. Prontuário/evolução por sessão  
2. Integração de API com google agenda e meet para marcar e lembrar reunião atrelado ao email do psicólogo e do paciente.
3. Lembretes de sessão (e-mail/WhatsApp)  
4. Recibos e faturamento 
5. Histórico comparativo da Roda da Vida  
6. Dashboard de acompanhamento clínico  
7. Documentos do paciente
7. Portal do paciente (se houver demanda)  

