import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { R as Route$b } from "./router-C0lyWhsY.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, E as User, G as ClipboardList, k as Activity, H as FileText } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/zod.mjs";
function ClientLayout() {
  const {
    id
  } = Route$b.useParams();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const {
    data: client
  } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const tabs = [{
    to: `/clientes/${id}`,
    label: "Visão geral",
    icon: User,
    exact: true
  }, {
    to: `/clientes/${id}/prontuario`,
    label: "Prontuário",
    icon: ClipboardList
  }, {
    to: `/clientes/${id}/roda-adulto`,
    label: "Roda (Adulto)",
    icon: Activity
  }, {
    to: `/clientes/${id}/roda-adolescente`,
    label: "Roda (Adolescente)",
    icon: Activity
  }, {
    to: `/clientes/${id}/roda-via`,
    label: "Roda VIA ME",
    icon: Activity
  }, {
    to: `/clientes/${id}/anamnese`,
    label: "Anamnese",
    icon: FileText
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/clientes", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
      "Clientes"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: client?.full_name ?? "Carregando..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: client?.email ?? client?.phone ?? "—" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 border-b", children: tabs.map((t) => {
      const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: t.to, className: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-4 w-4" }),
        t.label
      ] }, t.to);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  ClientLayout as component
};
