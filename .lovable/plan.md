
# PsicoManager — Plano de arquitetura e implementação

Sistema web de gestão para psicólogo autônomo (single-user por conta), inspirado nos wireframes do Psicomanager. Foco inicial nas **Rodas da Vida (Adolescente e Adulto)** com exportação PDF, sobre uma base sólida de auth + clientes.

---

## 1. Stack e decisões técnicas

- **Frontend:** TanStack Start (já configurado) + React 19 + TypeScript.
- **UI:** Tailwind v4 + shadcn/ui + `lucide-react`. Sidebar via `shadcn Sidebar`.
- **Estado servidor:** TanStack Query (loaders + `useSuspenseQuery`).
- **Formulários:** `react-hook-form` + `zod`.
- **Gráficos Roda da Vida:** SVG customizado (interativo, clicável por segmento) + `recharts` para dashboards.
- **PDF:** `jspdf` + `html2canvas` (client-side; captura do SVG + metadados do cliente).
- **Backend:** Lovable Cloud (Supabase gerenciado) — Postgres + Auth + Storage + RLS.
- **Auth:** Email/senha + Google (padrão Lovable Cloud), rota `_authenticated` para tudo exceto `/auth`.

**Porquês:**
- SVG próprio para a Roda dá controle total sobre clique-por-fatia-e-nível (essencial no wireframe) — bibliotecas prontas de radar não suportam essa interação.
- jsPDF client-side evita função serverless e mantém o PDF sob controle do psicólogo (dados sensíveis não trafegam pelo servidor).
- Single-tenant por `user_id` mantém RLS trivial (`auth.uid() = user_id`) — sem necessidade de tabela de clínicas/roles nesta fase.

---

## 2. Estrutura de pastas

```text
src/
├── routes/
│   ├── __root.tsx                       (shell + providers + auth listener)
│   ├── index.tsx                        (landing → redirect /auth ou /dashboard)
│   ├── auth.tsx                         (login / signup / reset)
│   ├── reset-password.tsx
│   └── _authenticated/
│       ├── route.tsx                    (gate gerenciado; NÃO editar)
│       ├── dashboard.tsx                (Painel Geral)
│       ├── clientes.tsx                 (layout /clientes com Outlet)
│       ├── clientes.index.tsx           (listagem)
│       ├── clientes.novo.tsx            (cadastro)
│       ├── clientes.$id.tsx             (layout do cliente com abas)
│       ├── clientes.$id.index.tsx       (Principal — dados + painel de sessões)
│       ├── clientes.$id.cadastro.tsx    (edição completa)
│       ├── clientes.$id.anamnese.tsx
│       ├── clientes.$id.sessoes.tsx
│       ├── clientes.$id.roda-adolescente.tsx
│       ├── clientes.$id.roda-adulto.tsx
│       ├── agenda.tsx
│       ├── financeiro.tsx               (layout)
│       ├── financeiro.index.tsx         (Painel Financeiro)
│       ├── financeiro.receitas.tsx
│       ├── financeiro.despesas.tsx
│       ├── financeiro.fluxo-caixa.tsx
│       ├── relatorios.tsx
│       └── configuracoes.tsx            (perfil + conta)
├── components/
│   ├── layout/            (AppSidebar, TopBar, PageHeader)
│   ├── clients/           (ClientCard, ClientForm, AnamneseForm, ClientTabs)
│   ├── wheel/             (WheelOfLifeSVG, WheelSlice, WheelLegend, WheelPdfExport)
│   ├── finance/           (StatCard, TransactionsTable, CashFlowTable)
│   ├── schedule/          (WeekCalendar, SessionCard, SessionDialog)
│   └── ui/                (shadcn)
├── hooks/                 (useAuth, useWheel, useClients, useSessions)
├── lib/
│   ├── validation/        (schemas zod compartilhados)
│   ├── pdf/               (wheel-pdf.ts, client-report-pdf.ts)
│   └── utils.ts
└── integrations/supabase/ (client, types, auth-middleware — gerado)
```

---

## 3. Modelo de dados (Supabase / Postgres)

Todas as tabelas com `user_id uuid references auth.users(id)` + RLS `auth.uid() = user_id`. Timestamps `created_at`/`updated_at`.

| Tabela | Campos-chave | Observações |
|---|---|---|
| `profiles` | id (=auth.uid), full_name, cpf, phone, birth_date, avatar_url, address_json | Criada por trigger no signup |
| `clients` | id, user_id, full_name, cpf, rg, email, phone, gender, birth_date, social_name, notes, status (ativo/inativo/desistente/alta/espera), plan_type (sessao/mensalidade), session_value, group_tag | Núcleo |
| `anamnesis` | id, client_id, user_id, template_key (adulto/adolescente/infantil), data jsonb, filled_at | jsonb permite formulários flexíveis sem migrar schema |
| `sessions` | id, client_id, user_id, scheduled_at, duration_min, status (agendada/presente/ausente/cancelada), room, notes, value, paid | Alimenta agenda + financeiro |
| `wheel_entries` | id, client_id, user_id, wheel_type (adolescente/adulto), scores jsonb ({escola:8, familia:6, ...}), notes, taken_at | Histórico permite comparar evolução |
| `transactions` | id, user_id, kind (receita/despesa), category, description, amount, due_date, paid_at, client_id nullable, session_id nullable | Base do módulo Financeiro |
| `client_documents` | id, client_id, user_id, storage_path, filename, mime, size | Storage bucket privado `client-docs` |

**Storage buckets:** `avatars` (público), `client-docs` (privado, RLS por user_id).

**Enums:** `client_status`, `session_status`, `transaction_kind`, `wheel_type`, `plan_type`.

**Áreas fixas da Roda:**
- Adolescente (8): escola, família, notas, amigos, saúde, diversão, autoconceito, crescimento.
- Adulto (10): autocuidado, atividade física, emocional, espiritual, tempo livre, profissional, financeira, intelectual/estudos, convívio familiar, lazer.

Guardadas como `const` no frontend + validadas no zod schema do `scores`.

---

## 4. Fluxo de autenticação e navegação

```text
/  ──▶ redireciona conforme sessão
       ├── sem sessão ──▶ /auth (login / signup / esqueci senha)
       └── com sessão ──▶ /dashboard

/auth ──▶ signup cria profile via trigger ──▶ /dashboard
/reset-password ──▶ updateUser({password}) ──▶ /auth

/_authenticated (gate gerenciado, ssr:false)
   ├── /dashboard
   ├── /clientes ──▶ /clientes/:id (abas: Principal, Cadastro, Anamnese, Sessões, Roda Adolescente, Roda Adulto)
   ├── /agenda
   ├── /financeiro (Painel, Receitas, Despesas, Fluxo de Caixa)
   ├── /relatorios
   └── /configuracoes
```

Sidebar recolhível (`collapsible="icon"`) com ícones + rótulos, item ativo destacado via `useRouterState`. Header com busca "Buscar cliente" + sino + avatar.

---

## 5. Rodas da Vida (prioridade #1)

Componente `WheelOfLifeSVG` reutilizável:
- Recebe `areas: {key, label, color}[]` e `values: Record<key, 1..10>`.
- Renderiza círculos concêntricos (10 anéis) + fatias radiais.
- Clique em `(fatia, nível)` seta o valor daquela área. Hover destaca. Fatia preenchida do centro até o nível escolhido com a cor da área.
- Estado local + `onChange`; página persiste em `wheel_entries` (histórico) via TanStack Query mutation.
- Botão **Exportar PDF**: `WheelPdfExport` renderiza cabeçalho (nome do cliente, data, psicólogo) + SVG (via `html2canvas`) + tabela de notas + espaço para observações.

Duas páginas (`roda-adolescente`, `roda-adulto`) usam o mesmo componente com config de áreas diferente. Aba "Histórico" mostra entradas anteriores para comparação.

---

## 6. Design system

- Paleta inspirada nos wireframes: primária **índigo/roxo** (`oklch(0.45 0.18 275)`), acentos por cor da fatia da roda; fundo `#F7F8FB`, cards brancos com sombras suaves.
- Tipografia: **Plus Jakarta Sans** (títulos) + **Inter** (corpo) via `<link>` no `__root.tsx`.
- Todos os tokens em `src/styles.css` (`@theme` em oklch). Nada de cores hardcoded nos componentes.
- Componentes base: `PageHeader`, `StatCard`, `EmptyState`, `DataTable`, `ConfirmDialog`, `FormField` — reutilizados em todos os módulos.

---

## 7. Segurança

- RLS em TODAS as tabelas: `user_id = auth.uid()`.
- `profiles` com trigger `on_auth_user_created` para autopopular.
- Validação zod dupla (cliente + server function quando aplicável).
- CPF/telefone: máscaras + validação; nunca em logs.
- Sem service_role no cliente. PDF gerado client-side (dado do paciente não sai do browser).
- Storage `client-docs` privado com policies por `user_id`.

---

## 8. Roteiro de entrega (fases)

**Fase 1 — Base + Rodas da Vida (prioridade solicitada)**
1. Habilitar Lovable Cloud, criar migrations: `profiles`, `clients`, `wheel_entries` + enums + RLS + trigger de profile.
2. Auth (email/senha + Google) — telas `/auth`, `/reset-password`.
3. Shell autenticado: `AppSidebar` + header + `_authenticated`.
4. CRUD mínimo de clientes (listagem + criação rápida) — necessário para vincular a Roda.
5. Componente `WheelOfLifeSVG` interativo.
6. Páginas `roda-adolescente` e `roda-adulto` com salvar + histórico + **exportar PDF**.

**Fase 2 — Clientes completo**
- Página do cliente com abas (Principal, Cadastro completo, Anamnese, Sessões).
- Anamnese com template Adulto/Adolescente/Infantil (jsonb).
- Upload de documentos.

**Fase 3 — Agenda**
- Views mês/semana/dia, criar/editar sessão, status, filtro por situação.

**Fase 4 — Financeiro**
- Receitas, despesas, fluxo de caixa, painel financeiro com gráficos, geração automática de receita ao criar sessão.

**Fase 5 — Relatórios + Configurações**
- Dashboards (clientes por gênero/idade, sessões, pagamentos), edição de perfil, alterar senha.

Cada fase termina com um marco publicável.

---

## 9. Melhorias propostas em relação ao referencial

- **Roda da Vida com histórico e comparação temporal** (linha do tempo de evolução) — o referencial mostra só a última.
- **Command palette** (`⌘K`) para busca global de cliente.
- **Modo escuro** pronto desde o início.
- **Responsividade real** (o referencial é só desktop) — sidebar vira sheet no mobile.
- **Export PDF do prontuário completo** (cadastro + anamnese + rodas) além do PDF só da Roda.
- **Lembretes automáticos** de sessões via toast/notificações no painel.

---

## Perguntas em aberto (não bloqueiam o início)

- Google OAuth: incluir no login já na Fase 1 ou apenas email/senha?
- PDF da Roda: layout retrato A4 com logo do psicólogo (do perfil) no cabeçalho, ok?
- Anamnese: manter os 3 templates (Adulto/Adolescente/Infantil) fixos ou permitir o psicólogo editar campos?

Posso seguir com essas premissas assim que você aprovar o plano.
