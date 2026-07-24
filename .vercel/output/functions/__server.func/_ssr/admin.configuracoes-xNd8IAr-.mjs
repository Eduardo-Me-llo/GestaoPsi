import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { l as logAudit } from "./audit-C4hqcqA9.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { S as Switch } from "./switch-CQ4rbtn8.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { Y as Save, Z as Image, _ as Building2, $ as ShieldAlert, a0 as Mail, a1 as SlidersHorizontal } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
const empty = {
  platform_name: "GestãoPsi",
  logo_url: null,
  institutional_data: {},
  auth_settings: {},
  email_settings: {},
  general_params: {},
  security_settings: {}
};
function SystemSettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = reactExports.useState(empty);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("system_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data2;
    }
  });
  reactExports.useEffect(() => {
    if (data) {
      setForm({
        platform_name: data.platform_name ?? "GestãoPsi",
        logo_url: data.logo_url ?? null,
        institutional_data: data.institutional_data ?? {},
        auth_settings: data.auth_settings ?? {},
        email_settings: data.email_settings ?? {},
        general_params: data.general_params ?? {},
        security_settings: data.security_settings ?? {}
      });
    }
  }, [data]);
  const save = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("system_settings").update({
        platform_name: form.platform_name,
        logo_url: form.logo_url,
        institutional_data: form.institutional_data,
        auth_settings: form.auth_settings,
        email_settings: form.email_settings,
        general_params: form.general_params,
        security_settings: form.security_settings
      }).eq("id", true);
      if (error) throw error;
      await logAudit({
        action: "settings_update",
        entity: "system_settings"
      });
    },
    onSuccess: () => {
      toast.success("Configurações salvas.");
      qc.invalidateQueries({
        queryKey: ["system-settings"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const setInst = (k, v) => setForm((f) => ({
    ...f,
    institutional_data: {
      ...f.institutional_data,
      [k]: v
    }
  }));
  const setAuth = (k, v) => setForm((f) => ({
    ...f,
    auth_settings: {
      ...f.auth_settings,
      [k]: v
    }
  }));
  const setEmail = (k, v) => setForm((f) => ({
    ...f,
    email_settings: {
      ...f.email_settings,
      [k]: v
    }
  }));
  const setSec = (k, v) => setForm((f) => ({
    ...f,
    security_settings: {
      ...f.security_settings,
      [k]: v
    }
  }));
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Carregando..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Configurações do sistema" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Parâmetros globais da plataforma." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => save.mutate(), disabled: save.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
        "Salvar alterações"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-primary" }),
          "Identidade"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Nome e logo exibidos no sistema." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome da plataforma" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.platform_name, onChange: (e) => setForm({
            ...form,
            platform_name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "URL do logo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.logo_url ?? "", onChange: (e) => setForm({
            ...form,
            logo_url: e.target.value || null
          }), placeholder: "https://..." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4 text-primary" }),
        "Dados institucionais"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Razão social" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.institutional_data.company_name ?? "", onChange: (e) => setInst("company_name", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "CNPJ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.institutional_data.cnpj ?? "", onChange: (e) => setInst("cnpj", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail de suporte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.institutional_data.support_email ?? "", onChange: (e) => setInst("support_email", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.institutional_data.phone ?? "", onChange: (e) => setInst("phone", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Endereço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: form.institutional_data.address ?? "", onChange: (e) => setInst("address", e.target.value) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-primary" }),
          "Autenticação"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Estes parâmetros são preferências do painel. A aplicação efetiva de alguns depende também do Supabase Dashboard." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Permitir cadastro por e-mail/senha", checked: form.auth_settings.allow_email_signup ?? true, onChange: (v) => setAuth("allow_email_signup", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Permitir login com Google", checked: form.auth_settings.allow_google ?? true, onChange: (v) => setAuth("allow_google", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Exigir confirmação de e-mail", checked: form.auth_settings.require_email_confirmation ?? false, onChange: (v) => setAuth("require_email_confirmation", v) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-primary" }),
        "Configurações de e-mail"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome do remetente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.email_settings.from_name ?? "", onChange: (e) => setEmail("from_name", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail do remetente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email_settings.from_email ?? "", onChange: (e) => setEmail("from_email", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Servidor SMTP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.email_settings.smtp_host ?? "", onChange: (e) => setEmail("smtp_host", e.target.value), placeholder: "smtp.exemplo.com" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4 text-primary" }),
        "Parâmetros gerais e segurança"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duração padrão da sessão (min)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.general_params.default_session_duration ?? 50, onChange: (e) => setForm((f) => ({
            ...f,
            general_params: {
              ...f.general_params,
              default_session_duration: Number(e.target.value)
            }
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Fuso horário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.general_params.timezone ?? "America/Sao_Paulo", onChange: (e) => setForm((f) => ({
            ...f,
            general_params: {
              ...f.general_params,
              timezone: e.target.value
            }
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Timeout de sessão (min)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.security_settings.session_timeout_min ?? 60, onChange: (e) => setSec("session_timeout_min", Number(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Exigir senha forte", checked: form.security_settings.enforce_strong_password ?? false, onChange: (v) => setSec("enforce_strong_password", v) }) })
      ] })
    ] })
  ] });
}
function ToggleRow({
  label,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked, onCheckedChange: onChange })
  ] });
}
export {
  SystemSettingsPage as component
};
