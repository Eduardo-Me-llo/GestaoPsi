import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { f as format, p as ptBR, b as startOfYear, e as endOfYear } from "../_libs/date-fns.mjs";
import { x as CircleArrowUp, w as TrendingUp, y as CircleArrowDown, W as Wallet } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, b as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, c as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const currency = (n) => n.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});
function FinancePanel() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const {
    data = []
  } = useQuery({
    queryKey: ["transactions", "year", year],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("transactions").select("*").gte("due_date", startOfYear(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).lte("due_date", endOfYear(/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
      if (error) throw error;
      return data2;
    }
  });
  const totals = data.reduce((acc, t) => {
    const amt = Number(t.amount);
    if (t.kind === "receita") {
      acc.receitaTotal += amt;
      if (t.paid_at) acc.receitaPaga += amt;
      else acc.receitaAberta += amt;
    } else {
      acc.despesaTotal += amt;
    }
    return acc;
  }, {
    receitaTotal: 0,
    receitaPaga: 0,
    receitaAberta: 0,
    despesaTotal: 0
  });
  const monthly = Array.from({
    length: 12
  }, (_, i) => ({
    mes: format(new Date(year, i, 1), "MMM", {
      locale: ptBR
    }),
    receita: 0,
    despesa: 0
  }));
  data.forEach((t) => {
    const d = /* @__PURE__ */ new Date(t.due_date + "T12:00:00");
    const m = d.getMonth();
    if (t.kind === "receita") monthly[m].receita += Number(t.amount);
    else monthly[m].despesa += Number(t.amount);
  });
  const saldo = totals.receitaPaga - totals.despesaTotal;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleArrowUp, label: "Receitas recebidas", value: currency(totals.receitaPaga), tint: "text-emerald-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: TrendingUp, label: "A receber", value: currency(totals.receitaAberta), tint: "text-amber-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleArrowDown, label: "Despesas", value: currency(totals.despesaTotal), tint: "text-rose-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Wallet, label: "Saldo", value: currency(saldo), tint: saldo >= 0 ? "text-primary" : "text-rose-600" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display", children: [
        "Desempenho anual — ",
        year
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "h-80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: monthly, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", className: "stroke-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "mes", className: "text-xs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { className: "text-xs", tickFormatter: (v) => `R$${v}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => currency(Number(v)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "receita", name: "Receita", fill: "hsl(var(--primary))", radius: [6, 6, 0, 0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "despesa", name: "Despesa", fill: "oklch(0.65 0.2 20)", radius: [6, 6, 0, 0] })
      ] }) }) })
    ] })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  tint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-8 w-8 ${tint}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold font-display", children: value })
    ] })
  ] }) });
}
export {
  FinancePanel as component
};
