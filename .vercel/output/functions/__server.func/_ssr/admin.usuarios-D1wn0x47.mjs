import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { a as adminCreatePsychologist } from "./admin-actions-lkQflZiL.mjs";
import { l as logAudit } from "./audit-C4hqcqA9.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, f as DialogDescription, d as DialogFooter } from "./dialog-zjtn0avr.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-DteJ2TLP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { I as UserPlus, c as ShieldCheck, J as Power, K as ShieldMinus } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
import "./server-CB3iGyyA.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./auth-middleware-BB41Zovk.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
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
import "../_libs/radix-ui__react-alert-dialog.mjs";
function AdminUsersPage() {
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [revoking, setRevoking] = reactExports.useState(null);
  const qc = useQueryClient();
  const {
    data: rows = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("admin_users").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const invalidate = () => {
    qc.invalidateQueries({
      queryKey: ["admin-users"]
    });
    qc.invalidateQueries({
      queryKey: ["admin-psychologists"]
    });
  };
  const toggleActive = useMutation({
    mutationFn: async (u) => {
      const {
        error
      } = await supabase.from("profiles").update({
        is_active: !u.is_active
      }).eq("id", u.id);
      if (error) throw error;
      await logAudit({
        action: u.is_active ? "deactivate" : "activate",
        entity: "profiles",
        entityId: u.id
      });
    },
    onSuccess: () => {
      toast.success("Atualizado.");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const revokeAdmin = useMutation({
    mutationFn: async (u) => {
      const {
        error
      } = await supabase.from("user_roles").delete().eq("user_id", u.id).eq("role", "admin");
      if (error) throw error;
      await logAudit({
        action: "role_change",
        entity: "user_roles",
        entityId: u.id,
        details: {
          admin: false
        }
      });
    },
    onSuccess: () => {
      toast.success("Acesso de administrador removido.");
      setRevoking(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Usuários & Permissões" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Administradores da plataforma e níveis de acesso." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-2" }),
          "Novo administrador"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreateAdminDialog, { onClose: () => setCreateOpen(false), onDone: invalidate })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PromoteByEmail, { onDone: invalidate }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando..." }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Nenhum administrador cadastrado." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "E-mail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Papéis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Último acesso" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: rows.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: u.full_name || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: u.email || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: u.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: r === "admin" ? "default" : "secondary", className: "capitalize", children: [
          r === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3 mr-1" }),
          r
        ] }, r)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: u.last_sign_in_at ? format(new Date(u.last_sign_in_at), "dd/MM/yyyy HH:mm") : "Nunca" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: u.is_blocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Bloqueado" }) : u.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-600 hover:bg-emerald-600", children: "Ativo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Inativo" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", title: u.is_active ? "Desativar" : "Ativar", onClick: () => toggleActive.mutate(u), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", title: "Remover admin", onClick: () => setRevoking(u), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldMinus, { className: "h-4 w-4 text-rose-600" }) })
        ] }) })
      ] }, u.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!revoking, onOpenChange: (v) => !v && setRevoking(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remover acesso de administrador?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: revoking?.full_name || revoking?.email }),
          " deixará de ter acesso ao painel administrativo. A conta continua existindo como psicólogo."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-rose-600 hover:bg-rose-700", onClick: () => revoking && revokeAdmin.mutate(revoking), disabled: revokeAdmin.isPending, children: "Remover" })
      ] })
    ] }) })
  ] });
}
function PromoteByEmail({
  onDone
}) {
  const [email, setEmail] = reactExports.useState("");
  const mut = useMutation({
    mutationFn: async () => {
      const {
        data,
        error
      } = await supabase.from("admin_psychologists").select("id, email").eq("email", email.trim()).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Nenhum usuário encontrado com este e-mail.");
      const {
        error: insErr
      } = await supabase.from("user_roles").insert({
        user_id: data.id,
        role: "admin"
      });
      if (insErr && !insErr.message.includes("duplicate")) throw insErr;
      await logAudit({
        action: "role_change",
        entity: "user_roles",
        entityId: data.id,
        details: {
          admin: true
        }
      });
    },
    onSuccess: () => {
      toast.success("Usuário promovido a administrador.");
      setEmail("");
      onDone();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Promover usuário existente a administrador" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "e-mail do psicólogo", value: email, onChange: (e) => setEmail(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mut.mutate(), disabled: !email || mut.isPending, children: "Promover" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "O usuário precisa já ter uma conta. Ele passa a acessar o painel administrativo mantendo o perfil de psicólogo." })
  ] }) });
}
function CreateAdminDialog({
  onClose,
  onDone
}) {
  const [form, setForm] = reactExports.useState({
    fullName: "",
    email: "",
    password: ""
  });
  const mut = useMutation({
    mutationFn: async () => {
      const res = await adminCreatePsychologist({
        data: form
      });
      const newId = res?.id;
      if (newId) {
        const {
          error
        } = await supabase.from("user_roles").insert({
          user_id: newId,
          role: "admin"
        });
        if (error && !error.message.includes("duplicate")) throw error;
      }
      await logAudit({
        action: "insert",
        entity: "auth.users",
        details: {
          email: form.email,
          admin: true
        }
      });
    },
    onSuccess: () => {
      toast.success("Administrador criado!");
      onDone();
      onClose();
    },
    onError: (e) => toast.error(e.message.includes("service_role") || e.message.includes("SERVICE_ROLE") ? "Criação requer a chave service_role no servidor. Use 'Promover por e-mail'." : e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Novo administrador" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Cria uma conta nova já com acesso administrativo." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      mut.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome completo *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.fullName, onChange: (e) => setForm({
          ...form,
          fullName: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, value: form.email, onChange: (e) => setForm({
          ...form,
          email: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Senha provisória *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", required: true, minLength: 6, value: form.password, onChange: (e) => setForm({
          ...form,
          password: e.target.value
        }), placeholder: "Mínimo 6 caracteres" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Criar" })
      ] })
    ] })
  ] });
}
export {
  AdminUsersPage as component
};
