import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const tabs = [{
  to: "/financeiro",
  label: "Painel",
  exact: true
}, {
  to: "/financeiro/receitas",
  label: "Receitas"
}, {
  to: "/financeiro/despesas",
  label: "Despesas"
}, {
  to: "/financeiro/fluxo-caixa",
  label: "Fluxo de Caixa"
}];
function FinanceLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Financeiro" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Receitas, despesas e fluxo de caixa." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b flex gap-1 flex-wrap", children: tabs.map((t) => {
      const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: t.to, className: "px-4 py-2 text-sm font-medium border-b-2 transition -mb-px " + (active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"), children: t.label }, t.to);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  FinanceLayout as component
};
