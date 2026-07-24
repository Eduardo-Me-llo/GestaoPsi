import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { l as logAudit } from "./audit-C4hqcqA9.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { i as CircleAlert, B as Brain, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = reactExports.useState(null);
  const processed = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    async function handleCallback() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        const {
          error: exchangeError
        } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(`Falha ao verificar sessão: ${exchangeError.message}`);
          return;
        }
        await logAudit({
          action: "login",
          details: {
            method: "google"
          }
        });
        navigate({
          to: "/dashboard",
          replace: true
        });
        return;
      }
      const hash = url.hash;
      if (hash && hash.includes("access_token")) {
        const {
          data: sub
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            sub.subscription.unsubscribe();
            navigate({
              to: "/dashboard",
              replace: true
            });
          }
        });
        const timer = setTimeout(async () => {
          sub.subscription.unsubscribe();
          const {
            data: data2
          } = await supabase.auth.getSession();
          if (data2.session) {
            navigate({
              to: "/dashboard",
              replace: true
            });
          } else {
            setError("Tempo esgotado ao processar o login. Tente novamente.");
          }
        }, 5e3);
        return () => {
          clearTimeout(timer);
          sub.subscription.unsubscribe();
        };
      }
      const {
        data
      } = await supabase.auth.getSession();
      if (data.session) {
        navigate({
          to: "/dashboard",
          replace: true
        });
        return;
      }
      navigate({
        to: "/auth",
        replace: true
      });
    }
    handleCallback();
  }, [navigate]);
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6 text-destructive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Erro no login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/auth", children: "Voltar para o login" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gap-4 bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-7 w-7" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Verificando sua conta…" })
  ] });
}
export {
  AuthCallbackPage as component
};
