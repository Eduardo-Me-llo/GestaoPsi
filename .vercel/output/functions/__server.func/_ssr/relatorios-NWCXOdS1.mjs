import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { d as differenceInYears } from "../_libs/date-fns.mjs";
import { U as Users, C as Calendar, j as CircleCheck, D as DollarSign } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, P as PieChart, a as Pie, C as Cell, T as Tooltip, L as Legend, B as BarChart, b as CartesianGrid, X as XAxis, Y as YAxis, c as Bar } from "../_libs/recharts.mjs";
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
const COLORS = ["oklch(0.55 0.2 275)", "oklch(0.7 0.18 340)", "oklch(0.7 0.16 200)", "oklch(0.75 0.16 90)"];
const currency = (n) => n.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});
function ReportsPage() {
  const {
    data: clients = []
  } = useQuery({
    queryKey: ["report-clients"],
    queryFn: async () => (await supabase.from("clients").select("*")).data ?? []
  });
  const {
    data: sessions = []
  } = useQuery({
    queryKey: ["report-sessions"],
    queryFn: async () => (await supabase.from("sessions").select("*")).data ?? []
  });
  const {
    data: txs = []
  } = useQuery({
    queryKey: ["report-txs"],
    queryFn: async () => (await supabase.from("transactions").select("*")).data ?? []
  });
  const gender = groupBy(clients, (c) => c.gender || "Não informado");
  const genderData = Object.entries(gender).map(([name, v]) => ({
    name,
    value: v.length
  }));
  const buckets = {
    "0-12": 0,
    "13-17": 0,
    "18-29": 0,
    "30-49": 0,
    "50+": 0
  };
  clients.forEach((c) => {
    if (!c.birth_date) return;
    const a = differenceInYears(/* @__PURE__ */ new Date(), new Date(c.birth_date));
    if (a <= 12) buckets["0-12"]++;
    else if (a <= 17) buckets["13-17"]++;
    else if (a <= 29) buckets["18-29"]++;
    else if (a <= 49) buckets["30-49"]++;
    else buckets["50+"]++;
  });
  const ageData = Object.entries(buckets).map(([name, value]) => ({
    name,
    value
  }));
  const status = groupBy(clients, (c) => c.status || "ativo");
  const statusData = Object.entries(status).map(([name, v]) => ({
    name,
    value: v.length
  }));
  const sessionsRealized = sessions.filter((s) => s.status === "presente").length;
  const receitaPaga = txs.filter((t) => t.kind === "receita" && t.paid_at).reduce((s, t) => s + Number(t.amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Relatórios" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Visão geral da sua prática." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Users, label: "Clientes ativos", value: String(clients.filter((c) => c.status === "ativo").length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Calendar, label: "Sessões agendadas", value: String(sessions.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: CircleCheck, label: "Sessões realizadas", value: String(sessionsRealized) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: DollarSign, label: "Receita recebida", value: currency(receitaPaga) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Clientes por gênero" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: genderData, dataKey: "value", nameKey: "name", outerRadius: 90, label: true, children: genderData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Clientes por faixa etária" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: ageData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", className: "stroke-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", className: "text-xs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { className: "text-xs", allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", fill: "hsl(var(--primary))", radius: [6, 6, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Distribuição por status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: statusData, layout: "vertical", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", className: "stroke-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", className: "text-xs", allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "name", className: "text-xs capitalize", width: 100 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", fill: "oklch(0.7 0.18 340)", radius: [0, 6, 6, 0] })
        ] }) }) })
      ] })
    ] })
  ] });
}
function Kpi({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold font-display", children: value })
    ] })
  ] }) });
}
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}
export {
  ReportsPage as component
};
