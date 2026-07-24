import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { f as format, p as ptBR, b as startOfYear, e as endOfYear } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const currency = (n) => n.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});
function CashFlowPage() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const {
    data = [],
    isLoading
  } = useQuery({
    queryKey: ["transactions", "cashflow", year],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("transactions").select("*").gte("due_date", startOfYear(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).lte("due_date", endOfYear(/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
      if (error) throw error;
      return data2;
    }
  });
  const months = Array.from({
    length: 12
  }, (_, i) => ({
    idx: i,
    label: format(new Date(year, i, 1), "MMMM", {
      locale: ptBR
    }),
    receita: 0,
    despesa: 0
  }));
  data.forEach((t) => {
    const m = (/* @__PURE__ */ new Date(t.due_date + "T12:00:00")).getMonth();
    if (t.kind === "receita") months[m].receita += Number(t.amount);
    else months[m].despesa += Number(t.amount);
  });
  let acumulado = 0;
  const rows = months.map((m) => {
    const saldo = m.receita - m.despesa;
    acumulado += saldo;
    return {
      ...m,
      saldo,
      acumulado
    };
  });
  const total = rows.reduce((acc, r) => ({
    receita: acc.receita + r.receita,
    despesa: acc.despesa + r.despesa
  }), {
    receita: 0,
    despesa: 0
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Mês" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Receitas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Despesas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Saldo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Acumulado" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 capitalize", children: r.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-emerald-600", children: currency(r.receita) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-rose-600", children: currency(r.despesa) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right font-medium " + (r.saldo >= 0 ? "text-emerald-700" : "text-rose-700"), children: currency(r.saldo) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right font-semibold " + (r.acumulado >= 0 ? "text-primary" : "text-rose-700"), children: currency(r.acumulado) })
    ] }, r.idx)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "bg-muted/30 font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: "Total" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-emerald-700", children: currency(total.receita) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-rose-700", children: currency(total.despesa) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", colSpan: 2, children: currency(total.receita - total.despesa) })
    ] }) })
  ] }) }) });
}
export {
  CashFlowPage as component
};
