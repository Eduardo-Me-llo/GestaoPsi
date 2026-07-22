import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/financeiro")({
  component: FinanceLayout,
});

const tabs: { to: "/financeiro" | "/financeiro/receitas" | "/financeiro/despesas" | "/financeiro/fluxo-caixa"; label: string; exact?: boolean }[] = [
  { to: "/financeiro", label: "Painel", exact: true },
  { to: "/financeiro/receitas", label: "Receitas" },
  { to: "/financeiro/despesas", label: "Despesas" },
  { to: "/financeiro/fluxo-caixa", label: "Fluxo de Caixa" },
];

function FinanceLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground mt-1">Receitas, despesas e fluxo de caixa.</p>
      </div>
      <div className="border-b flex gap-1 flex-wrap">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={
                "px-4 py-2 text-sm font-medium border-b-2 transition -mb-px " +
                (active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
