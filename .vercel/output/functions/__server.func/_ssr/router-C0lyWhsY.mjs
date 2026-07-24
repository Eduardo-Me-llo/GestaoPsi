import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { o as objectType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-BCqe7GQn.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Página não encontrada." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "/",
        className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Voltar"
      }
    )
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Tente novamente ou volte ao início." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          children: "Tentar novamente"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border px-4 py-2 text-sm", children: "Início" })
    ] })
  ] }) });
}
const Route$u = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gestão para psicólogos" },
      { name: "description", content: "Sistema completo para psicólogos gerenciarem clientes, sessões, financeiro e Rodas da Vida." },
      { name: "author", content: "GestãoPsi" },
      { property: "og:title", content: "Gestão para psicólogos" },
      { property: "og:description", content: "Sistema completo para psicólogos gerenciarem clientes, sessões, financeiro e Rodas da Vida." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gestão para psicólogos" },
      { name: "twitter:description", content: "Sistema completo para psicólogos gerenciarem clientes, sessões, financeiro e Rodas da Vida." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a3c7fbeb-7741-41ba-892c-d6a811094f01/id-preview-09eddf65--3863a113-4fa5-4702-a4b0-ae3612e6bd31.lovable.app-1784047814655.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a3c7fbeb-7741-41ba-892c-d6a811094f01/id-preview-09eddf65--3863a113-4fa5-4702-a4b0-ae3612e6bd31.lovable.app-1784047814655.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$u.useRouteContext();
  const router2 = useRouter();
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router2.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router2, queryClient]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$t = () => import("./reset-password-CCqhaBNc.mjs");
const Route$t = createFileRoute("/reset-password")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./auth-DXVp8YSn.mjs");
const searchSchema = objectType({
  mode: enumType(["login", "signup", "forgot"]).optional()
});
const Route$s = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./route-CV25IHwk.mjs");
const Route$r = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw redirect({
        to: "/auth"
      });
    }
    return {
      user: data.session.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
async function getMyRoles() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  if (error) return [];
  return (data ?? []).map((r) => r.role);
}
async function checkIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  if (error || typeof data !== "boolean") {
    const roles = await getMyRoles();
    return roles.includes("admin");
  }
  return data;
}
function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: checkIsAdmin,
    staleTime: 5 * 60 * 1e3
  });
}
const $$splitComponentImporter$q = () => import("./route-DvHgg7Q0.mjs");
const Route$q = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw redirect({
        to: "/auth"
      });
    }
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      throw redirect({
        to: "/dashboard"
      });
    }
    return {
      user: data.session.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./index-BTU5dmpx.mjs");
const Route$p = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data
    } = await supabase.auth.getSession();
    if (data.session) throw redirect({
      to: "/dashboard"
    });
    throw redirect({
      to: "/auth"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./auth.callback-DQgFbzxv.mjs");
const Route$o = createFileRoute("/auth/callback")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./relatorios-NWCXOdS1.mjs");
const Route$n = createFileRoute("/_authenticated/relatorios")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./financeiro-CGQ3FKHQ.mjs");
const Route$m = createFileRoute("/_authenticated/financeiro")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./dashboard-gL6dqn-X.mjs");
const Route$l = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./configuracoes-DV2Q2WzY.mjs");
const Route$k = createFileRoute("/_authenticated/configuracoes")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./clientes-BFsOu0JM.mjs");
const Route$j = createFileRoute("/_authenticated/clientes")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./agenda-DmLY1b0W.mjs");
const Route$i = createFileRoute("/_authenticated/agenda")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./admin-DnBKM2J9.mjs");
const Route$h = createFileRoute("/_admin/admin")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./financeiro.index-CgwENL6M.mjs");
const Route$g = createFileRoute("/_authenticated/financeiro/")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./clientes.index-BHcnTC1Q.mjs");
const Route$f = createFileRoute("/_authenticated/clientes/")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./financeiro.receitas-BHGTvvxH.mjs");
const Route$e = createFileRoute("/_authenticated/financeiro/receitas")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./financeiro.fluxo-caixa-DzME_abp.mjs");
const Route$d = createFileRoute("/_authenticated/financeiro/fluxo-caixa")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./financeiro.despesas-C_BTI007.mjs");
const Route$c = createFileRoute("/_authenticated/financeiro/despesas")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./clientes._id-BAnS7FIF.mjs");
const Route$b = createFileRoute("/_authenticated/clientes/$id")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./admin.usuarios-D1wn0x47.mjs");
const Route$a = createFileRoute("/_admin/admin/usuarios")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.psicologos-C3ND0a8f.mjs");
const Route$9 = createFileRoute("/_admin/admin/psicologos")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.configuracoes-xNd8IAr-.mjs");
const Route$8 = createFileRoute("/_admin/admin/configuracoes")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin.clientes-Cms9eNMC.mjs");
const Route$7 = createFileRoute("/_admin/admin/clientes")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.auditoria-C9H8jMAh.mjs");
const Route$6 = createFileRoute("/_admin/admin/auditoria")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./clientes._id.index-WCocZvJS.mjs");
const Route$5 = createFileRoute("/_authenticated/clientes/$id/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./clientes._id.roda-via-Cms7nsdT.mjs");
const Route$4 = createFileRoute("/_authenticated/clientes/$id/roda-via")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./clientes._id.roda-adulto-D2ZBc9dn.mjs");
const Route$3 = createFileRoute("/_authenticated/clientes/$id/roda-adulto")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./clientes._id.roda-adolescente-COCJtsJA.mjs");
const Route$2 = createFileRoute("/_authenticated/clientes/$id/roda-adolescente")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./clientes._id.prontuario-BzA5MtND.mjs");
const Route$1 = createFileRoute("/_authenticated/clientes/$id/prontuario")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./clientes._id.anamnese-BVGGnorS.mjs");
const Route = createFileRoute("/_authenticated/clientes/$id/anamnese")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ResetPasswordRoute = Route$t.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$u
});
const AuthRoute = Route$s.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$u
});
const AuthenticatedRouteRoute = Route$r.update({
  id: "/_authenticated",
  getParentRoute: () => Route$u
});
const AdminRouteRoute = Route$q.update({
  id: "/_admin",
  getParentRoute: () => Route$u
});
const IndexRoute = Route$p.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$u
});
const AuthCallbackRoute = Route$o.update({
  id: "/callback",
  path: "/callback",
  getParentRoute: () => AuthRoute
});
const AuthenticatedRelatoriosRoute = Route$n.update({
  id: "/relatorios",
  path: "/relatorios",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedFinanceiroRoute = Route$m.update({
  id: "/financeiro",
  path: "/financeiro",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$l.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedConfiguracoesRoute = Route$k.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedClientesRoute = Route$j.update({
  id: "/clientes",
  path: "/clientes",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAgendaRoute = Route$i.update({
  id: "/agenda",
  path: "/agenda",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AdminAdminRoute = Route$h.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AdminRouteRoute
});
const AuthenticatedFinanceiroIndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedClientesIndexRoute = Route$f.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedClientesRoute
});
const AuthenticatedFinanceiroReceitasRoute = Route$e.update({
  id: "/receitas",
  path: "/receitas",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroFluxoCaixaRoute = Route$d.update({
  id: "/fluxo-caixa",
  path: "/fluxo-caixa",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroDespesasRoute = Route$c.update({
  id: "/despesas",
  path: "/despesas",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedClientesIdRoute = Route$b.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AuthenticatedClientesRoute
});
const AdminAdminUsuariosRoute = Route$a.update({
  id: "/usuarios",
  path: "/usuarios",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminPsicologosRoute = Route$9.update({
  id: "/psicologos",
  path: "/psicologos",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminConfiguracoesRoute = Route$8.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminClientesRoute = Route$7.update({
  id: "/clientes",
  path: "/clientes",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminAuditoriaRoute = Route$6.update({
  id: "/auditoria",
  path: "/auditoria",
  getParentRoute: () => AdminAdminRoute
});
const AuthenticatedClientesIdIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedClientesIdRoute
});
const AuthenticatedClientesIdRodaViaRoute = Route$4.update({
  id: "/roda-via",
  path: "/roda-via",
  getParentRoute: () => AuthenticatedClientesIdRoute
});
const AuthenticatedClientesIdRodaAdultoRoute = Route$3.update({
  id: "/roda-adulto",
  path: "/roda-adulto",
  getParentRoute: () => AuthenticatedClientesIdRoute
});
const AuthenticatedClientesIdRodaAdolescenteRoute = Route$2.update({
  id: "/roda-adolescente",
  path: "/roda-adolescente",
  getParentRoute: () => AuthenticatedClientesIdRoute
});
const AuthenticatedClientesIdProntuarioRoute = Route$1.update({
  id: "/prontuario",
  path: "/prontuario",
  getParentRoute: () => AuthenticatedClientesIdRoute
});
const AuthenticatedClientesIdAnamneseRoute = Route.update({
  id: "/anamnese",
  path: "/anamnese",
  getParentRoute: () => AuthenticatedClientesIdRoute
});
const AdminAdminRouteChildren = {
  AdminAdminAuditoriaRoute,
  AdminAdminClientesRoute,
  AdminAdminConfiguracoesRoute,
  AdminAdminPsicologosRoute,
  AdminAdminUsuariosRoute
};
const AdminAdminRouteWithChildren = AdminAdminRoute._addFileChildren(
  AdminAdminRouteChildren
);
const AdminRouteRouteChildren = {
  AdminAdminRoute: AdminAdminRouteWithChildren
};
const AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(
  AdminRouteRouteChildren
);
const AuthenticatedClientesIdRouteChildren = {
  AuthenticatedClientesIdAnamneseRoute,
  AuthenticatedClientesIdProntuarioRoute,
  AuthenticatedClientesIdRodaAdolescenteRoute,
  AuthenticatedClientesIdRodaAdultoRoute,
  AuthenticatedClientesIdRodaViaRoute,
  AuthenticatedClientesIdIndexRoute
};
const AuthenticatedClientesIdRouteWithChildren = AuthenticatedClientesIdRoute._addFileChildren(
  AuthenticatedClientesIdRouteChildren
);
const AuthenticatedClientesRouteChildren = {
  AuthenticatedClientesIdRoute: AuthenticatedClientesIdRouteWithChildren,
  AuthenticatedClientesIndexRoute
};
const AuthenticatedClientesRouteWithChildren = AuthenticatedClientesRoute._addFileChildren(
  AuthenticatedClientesRouteChildren
);
const AuthenticatedFinanceiroRouteChildren = {
  AuthenticatedFinanceiroDespesasRoute,
  AuthenticatedFinanceiroFluxoCaixaRoute,
  AuthenticatedFinanceiroReceitasRoute,
  AuthenticatedFinanceiroIndexRoute
};
const AuthenticatedFinanceiroRouteWithChildren = AuthenticatedFinanceiroRoute._addFileChildren(
  AuthenticatedFinanceiroRouteChildren
);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAgendaRoute,
  AuthenticatedClientesRoute: AuthenticatedClientesRouteWithChildren,
  AuthenticatedConfiguracoesRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedFinanceiroRoute: AuthenticatedFinanceiroRouteWithChildren,
  AuthenticatedRelatoriosRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const AuthRouteChildren = {
  AuthCallbackRoute
};
const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRouteRoute: AdminRouteRouteWithChildren,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute: AuthRouteWithChildren,
  ResetPasswordRoute
};
const routeTree = Route$u._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$b as R,
  Route$5 as a,
  Route$4 as b,
  Route$3 as c,
  Route$2 as d,
  Route$1 as e,
  Route as f,
  router as r,
  useIsAdmin as u
};
