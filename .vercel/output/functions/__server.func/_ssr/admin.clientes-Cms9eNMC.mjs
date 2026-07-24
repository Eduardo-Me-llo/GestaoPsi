import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { l as logAudit } from "./audit-C4hqcqA9.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-zjtn0avr.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-DteJ2TLP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { z as Search, F as Pencil, Q as Ban, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
function AdminClientsPage() {
  const [q, setQ] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(null);
  const qc = useQueryClient();
  const {
    data: rows = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("admin_clients").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const filtered = rows.filter((r) => {
    const t = q.toLowerCase();
    return q === "" || r.full_name.toLowerCase().includes(t) || (r.cpf ?? "").includes(q) || (r.psychologist_name ?? "").toLowerCase().includes(t);
  });
  const invalidate = () => qc.invalidateQueries({
    queryKey: ["admin-clients"]
  });
  const block = useMutation({
    mutationFn: async (c) => {
      const {
        error
      } = await supabase.from("clients").update({
        status: "inativo"
      }).eq("id", c.id);
      if (error) throw error;
      await logAudit({
        action: "block",
        entity: "clients",
        entityId: c.id
      });
    },
    onSuccess: () => {
      toast.success("Cliente inativado.");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente excluído.");
      setDeleting(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Clientes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Todos os clientes da plataforma, com o psicólogo responsável." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Buscar por nome, CPF ou psicólogo", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Nenhum cliente encontrado." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "CPF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Psicólogo responsável" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Cadastro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: c.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: c.cpf || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: c.psychologist_name || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: format(new Date(c.created_at), "dd/MM/yyyy") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: c.status === "ativo" ? "default" : "secondary", className: "capitalize", children: c.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", title: "Editar", onClick: () => setEditing(c), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", title: "Inativar", onClick: () => block.mutate(c), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", title: "Excluir", onClick: () => setDeleting(c), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-600" }) })
        ] }) })
      ] }, c.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: editing && /* @__PURE__ */ jsxRuntimeExports.jsx(EditClientDialog, { row: editing, onClose: () => setEditing(null), onDone: invalidate }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleting, onOpenChange: (v) => !v && setDeleting(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir cliente?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Remove permanentemente ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleting?.full_name }),
          " e seus dados (sessões, anamneses, rodas). Esta ação não pode ser desfeita."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-rose-600 hover:bg-rose-700", onClick: () => deleting && del.mutate(deleting.id), disabled: del.isPending, children: "Excluir" })
      ] })
    ] }) })
  ] });
}
function EditClientDialog({
  row,
  onClose,
  onDone
}) {
  const [form, setForm] = reactExports.useState({
    full_name: row.full_name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    cpf: row.cpf ?? ""
  });
  const mut = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("clients").update({
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone || null,
        cpf: form.cpf || null
      }).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente atualizado.");
      onDone();
      onClose();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Editar cliente" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      mut.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome completo *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.full_name, onChange: (e) => setForm({
          ...form,
          full_name: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "CPF" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.cpf, onChange: (e) => setForm({
            ...form,
            cpf: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Salvar" })
      ] })
    ] })
  ] });
}
export {
  AdminClientsPage as component
};
