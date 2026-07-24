import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { O as Outlet, f as useRouterState, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { S as SidebarProvider, a as SidebarTrigger, u as useSidebar, b as Sidebar, c as SidebarHeader, d as SidebarContent, e as SidebarGroup, f as SidebarGroupContent, g as SidebarMenu, h as SidebarMenuItem, i as SidebarMenuButton, j as SidebarFooter } from "./sidebar-oR2XQ0Jh.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-b9fucEBX.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { g as getAvatarPath, a as getSignedAvatarUrl } from "./user-settings-CQlX_81E.mjs";
import { u as useIsAdmin } from "./router-C0lyWhsY.mjs";
import { l as logAudit } from "./audit-C4hqcqA9.mjs";
import "../_libs/sonner.mjs";
import { B as Brain, a as LayoutDashboard, U as Users, C as Calendar, D as DollarSign, b as ChartColumn, S as Settings, c as ShieldCheck, d as LogOut, e as Bell } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./input-C0QjszdI.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
async function buildNotifications() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const now = /* @__PURE__ */ new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1e3);
  const [sessionsRes, txsRes] = await Promise.all([
    supabase.from("sessions").select("id, scheduled_at, client_id, status, clients(full_name)").gte("scheduled_at", now.toISOString()).lt("scheduled_at", in48h.toISOString()).eq("status", "agendada").order("scheduled_at").limit(10),
    supabase.from("transactions").select("id, description, due_date, amount, paid_at, kind").is("paid_at", null).lte("due_date", new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 10)).order("due_date").limit(10)
  ]);
  const notifs = [];
  (sessionsRes.data ?? []).forEach((s) => {
    const dt = new Date(s.scheduled_at);
    notifs.push({
      id: `s-${s.id}`,
      title: `Sessão: ${s.clients?.full_name ?? "Cliente"}`,
      description: dt.toLocaleString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      }),
      to: "/agenda",
      date: s.scheduled_at
    });
  });
  (txsRes.data ?? []).forEach((t) => {
    notifs.push({
      id: `t-${t.id}`,
      title: t.kind === "receita" ? `A receber: ${t.description}` : `A pagar: ${t.description}`,
      description: `Vence em ${new Date(t.due_date).toLocaleDateString("pt-BR")} · R$ ${Number(t.amount).toFixed(2)}`,
      to: "/financeiro"
    });
  });
  return notifs;
}
function NotificationBell() {
  const { data: notifs = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: buildNotifications,
    refetchInterval: 5 * 60 * 1e3
  });
  const count = notifs.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "icon", className: "relative", "aria-label": "Notificações", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
      count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold grid place-items-center", children: count > 9 ? "9+" : count })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-80 p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: "Notificações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Próximas 48h e pendências" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-96 overflow-y-auto divide-y", children: [
        notifs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "Sem notificações." }),
        notifs.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: n.to,
            className: "block p-3 hover:bg-muted/50 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: n.description })
            ]
          },
          n.id
        ))
      ] })
    ] })
  ] });
}
const nav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Relatórios", url: "/relatorios", icon: ChartColumn },
  { title: "Configurações", url: "/configuracoes", icon: Settings }
];
function AppShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex w-full bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-14 flex items-center justify-between border-b bg-background px-4 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground hidden md:inline", children: "GestãoPsi" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderAvatar, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto p-6", children })
    ] })
  ] }) });
}
function HeaderAvatar() {
  const { data: profile } = useQuery({
    queryKey: ["profile", "header"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("full_name, address").eq("id", u.user.id).maybeSingle();
      return { ...data, email: u.user.email };
    }
  });
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const path = getAvatarPath(profile?.address);
    if (!path) {
      setUrl(null);
      return;
    }
    getSignedAvatarUrl(path).then(setUrl);
  }, [profile?.address]);
  const initials = (profile?.full_name || profile?.email || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/configuracoes", "aria-label": "Configurações", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8", children: [
    url && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: url, alt: "Perfil" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: initials })
  ] }) });
}
function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isActive = (url) => url === "/dashboard" ? pathname === url : pathname.startsWith(url);
  const handleSignOut = async () => {
    await logAudit({ action: "logout" });
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, { collapsible: "icon", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, { className: "border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4" }) }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold", children: "GestãoPsi" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroup, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarMenu, { children: [
      nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuButton, { asChild: true, isActive: isActive(item.url), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.url, className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4" }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.title })
      ] }) }) }, item.url)),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuButton, { asChild: true, isActive: pathname.startsWith("/admin"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Painel Admin" })
      ] }) }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarFooter, { className: "border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "w-full justify-start", onClick: handleSignOut, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "Sair" })
    ] }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
export {
  SplitComponent as component
};
