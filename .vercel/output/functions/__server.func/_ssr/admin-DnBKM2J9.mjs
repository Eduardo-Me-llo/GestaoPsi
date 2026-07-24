import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-DCDRzI6q.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { f as Stethoscope, U as Users, u as CalendarCheck, v as UserCheck, w as TrendingUp, k as Activity, h as ScrollText } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, b as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, d as Area } from "../_libs/recharts.mjs";
import { f as format, s as startOfMonth, a as subMonths, p as ptBR } from "../_libs/date-fns.mjs";
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
import "../_libs/class-variance-authority.mjs";
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
function AdminDashboard() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [psychRes, clientsRes, sessionsRes, activeRes, profilesRes, auditRes] = await Promise.all([supabase.from("user_roles").select("user_id", {
        count: "exact",
        head: true
      }).eq("role", "psicologo"), supabase.from("clients").select("id", {
        count: "exact",
        head: true
      }), supabase.from("sessions").select("id", {
        count: "exact",
        head: true
      }).eq("status", "realizada"), supabase.from("profiles").select("id", {
        count: "exact",
        head: true
      }).eq("is_active", true).eq("is_blocked", false), supabase.from("profiles").select("id, full_name, created_at").order("created_at", {
        ascending: false
      }).limit(6), supabase.from("audit_logs").select("id, action, entity, actor_email, created_at").order("created_at", {
        ascending: false
      }).limit(8)]);
      const since = startOfMonth(subMonths(/* @__PURE__ */ new Date(), 5)).toISOString();
      const [profGrowth, cliGrowth] = await Promise.all([supabase.from("profiles").select("created_at").gte("created_at", since), supabase.from("clients").select("created_at").gte("created_at", since)]);
      const buckets = {};
      for (let i = 5; i >= 0; i--) {
        const key = format(subMonths(/* @__PURE__ */ new Date(), i), "MMM/yy", {
          locale: ptBR
        });
        buckets[key] = {
          psicologos: 0,
          clientes: 0
        };
      }
      const bucketKey = (iso) => format(new Date(iso), "MMM/yy", {
        locale: ptBR
      });
      (profGrowth.data ?? []).forEach((r) => {
        const k = bucketKey(r.created_at);
        if (buckets[k]) buckets[k].psicologos++;
      });
      (cliGrowth.data ?? []).forEach((r) => {
        const k = bucketKey(r.created_at);
        if (buckets[k]) buckets[k].clientes++;
      });
      const growth = Object.entries(buckets).map(([month, v]) => ({
        month,
        ...v
      }));
      const monthStart = startOfMonth(/* @__PURE__ */ new Date()).toISOString();
      const newThisMonth = (profilesRes.data ?? []).filter((p) => p.created_at >= monthStart).length;
      return {
        psychologists: psychRes.count ?? 0,
        clients: clientsRes.count ?? 0,
        sessionsDone: sessionsRes.count ?? 0,
        activeUsers: activeRes.count ?? 0,
        newThisMonth,
        growth,
        recentProfiles: profilesRes.data ?? [],
        recentAudit: auditRes.data ?? []
      };
    }
  });
  const cards = [{
    label: "Psicólogos cadastrados",
    value: data?.psychologists ?? 0,
    icon: Stethoscope,
    tint: "bg-primary/10 text-primary"
  }, {
    label: "Clientes na plataforma",
    value: data?.clients ?? 0,
    icon: Users,
    tint: "bg-blue-500/10 text-blue-600"
  }, {
    label: "Atendimentos realizados",
    value: data?.sessionsDone ?? 0,
    icon: CalendarCheck,
    tint: "bg-emerald-500/10 text-emerald-600"
  }, {
    label: "Usuários ativos",
    value: data?.activeUsers ?? 0,
    icon: UserCheck,
    tint: "bg-purple-500/10 text-purple-600"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Dashboard administrativo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Visão geral e indicadores da plataforma." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold mt-1", children: isLoading ? "…" : c.value })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 place-items-center rounded-lg ${c.tint}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5" }) })
    ] }) }) }, c.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
          "Crescimento (últimos 6 meses)"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: data?.growth ?? [], margin: {
          left: -20,
          right: 8
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gPsi", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "hsl(var(--primary))", stopOpacity: 0.4 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "hsl(var(--primary))", stopOpacity: 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gCli", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#3b82f6", stopOpacity: 0.4 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#3b82f6", stopOpacity: 0 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", className: "stroke-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", fontSize: 12, tickLine: false, axisLine: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 12, tickLine: false, axisLine: false, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "psicologos", name: "Psicólogos", stroke: "hsl(var(--primary))", fill: "url(#gPsi)", strokeWidth: 2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "clientes", name: "Clientes", stroke: "#3b82f6", fill: "url(#gCli)", strokeWidth: 2 })
        ] }) }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
          "Resumo"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Novos cadastros no mês", value: data?.newThisMonth ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Média de clientes/psicólogo", value: data && data.psychologists > 0 ? (data.clients / data.psychologists).toFixed(1) : "0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Atendimentos realizados", value: data?.sessionsDone ?? 0 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Últimos cadastros" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 divide-y", children: [
          (data?.recentProfiles ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-sm text-muted-foreground", children: "Nenhum cadastro ainda." }),
          (data?.recentProfiles ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: p.full_name || "Sem nome" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: format(new Date(p.created_at), "dd/MM/yyyy") })
          ] }, p.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "h-4 w-4 text-primary" }),
            "Atividades recentes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/auditoria", className: "text-xs text-primary hover:underline", children: "Ver tudo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 divide-y", children: [
          (data?.recentAudit ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-sm text-muted-foreground", children: "Sem atividades registradas." }),
          (data?.recentAudit ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-6 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: a.action }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate", children: a.entity ?? "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: a.actor_email ?? "sistema" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: format(new Date(a.created_at), "dd/MM HH:mm") })
          ] }, a.id))
        ] })
      ] })
    ] })
  ] });
}
function SummaryRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold", children: value })
  ] });
}
export {
  AdminDashboard as component
};
