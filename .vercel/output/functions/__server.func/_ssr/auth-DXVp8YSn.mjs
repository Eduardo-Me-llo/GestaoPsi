import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useSearch } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { l as logAudit } from "./audit-C4hqcqA9.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Brain, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({
    from: "/auth"
  });
  const [emailMode, setEmailMode] = reactExports.useState(search.mode ?? "login");
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) {
        navigate({
          to: "/dashboard",
          replace: true
        });
      }
    });
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate({
          to: "/dashboard",
          replace: true
        });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-full bg-gradient-to-br from-primary/10 via-background to-primary-glow/10 flex items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-7 w-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-foreground", children: "GestãoPsi" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Sistema de gestão para psicólogos" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-xl border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-xl", children: "Bem-vindo(a)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Acesse sua conta para continuar" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ou continue com e-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border border-border overflow-hidden", children: ["login", "signup", "forgot"].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEmailMode(mode), className: `flex-1 py-2 text-xs font-medium transition-colors ${emailMode === mode ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`, children: mode === "login" ? "Entrar" : mode === "signup" ? "Cadastrar" : "Recuperar" }, mode)) }),
        emailMode === "login" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, {}),
        emailMode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx(SignupForm, { onDone: () => setEmailMode("login") }),
        emailMode === "forgot" && /* @__PURE__ */ jsxRuntimeExports.jsx(ForgotForm, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground pt-1 leading-relaxed", children: [
          "Ao entrar, você concorda com os",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "underline cursor-pointer hover:text-foreground", children: "Termos de Uso" }),
          " ",
          "e a",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "underline cursor-pointer hover:text-foreground", children: "Política de Privacidade" }),
          "."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: "Seus dados clínicos são protegidos com criptografia e Row Level Security." })
  ] }) });
}
function GoogleButton() {
  const [loading, setLoading] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "lg", className: "w-full h-12 font-medium border-border/80 hover:bg-muted/60 transition-all", disabled: loading, onClick: async () => {
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // O Supabase redireciona para /auth/callback?code=...
        // após autenticação no Google. Essa rota troca o code por sessão
        // e navega para /dashboard.
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account"
        }
      }
    });
    if (error) {
      const msg = error.message.includes("provider is not enabled") ? "Login com Google não está habilitado no momento. Use e-mail e senha." : `Erro ao entrar com Google: ${error.message}`;
      toast.error(msg);
      setLoading(false);
    }
  }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "h-5 w-5 shrink-0", "aria-hidden": true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
    ] }),
    "Continuar com Google"
  ] }) });
}
function LoginForm() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-3", onSubmit: async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) {
      return toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
    }
    await logAudit({
      action: "login",
      details: {
        method: "email"
      }
    });
    toast.success("Bem-vindo(a) de volta!");
    navigate({
      to: "/dashboard",
      replace: true
    });
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-email", children: "E-mail" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "login-email", type: "email", placeholder: "seu@email.com", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-pass", children: "Senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "login-pass", type: "password", placeholder: "••••••••", required: true, value: password, onChange: (e) => setPassword(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Entrar" })
  ] });
}
function SignupForm({
  onDone
}) {
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-3", onSubmit: async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Senha deve ter ao menos 6 caracteres.");
    setLoading(true);
    const {
      data,
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (data.session) {
      toast.success("Conta criada. Boas-vindas ao GestãoPsi!");
      navigate({
        to: "/dashboard",
        replace: true
      });
      return;
    }
    toast.info("Conta criada. Verifique seu e-mail para confirmar o cadastro.");
    onDone();
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-name", children: "Nome completo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "s-name", placeholder: "Dr(a). João Silva", required: true, value: fullName, onChange: (e) => setFullName(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-email", children: "E-mail" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "s-email", type: "email", placeholder: "seu@email.com", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-pass", children: "Senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "s-pass", type: "password", placeholder: "Mínimo 6 caracteres", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Criar conta" })
  ] });
}
function ForgotForm() {
  const [email, setEmail] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [sent, setSent] = reactExports.useState(false);
  if (sent) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-4 text-sm text-center text-muted-foreground space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "E-mail enviado!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Verifique sua caixa de entrada e clique no link para redefinir a senha." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-3", onSubmit: async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "f-email", children: "E-mail cadastrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "f-email", type: "email", placeholder: "seu@email.com", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "outline", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Enviar link de redefinição" })
  ] });
}
export {
  AuthPage as component
};
