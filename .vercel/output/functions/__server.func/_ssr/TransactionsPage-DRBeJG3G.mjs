import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-zjtn0avr.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as Plus, s as Check, F as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
const currency = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
function TransactionsPage({ kind, title }) {
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["transactions", kind],
    queryFn: async () => {
      const { data: data2, error } = await supabase.from("transactions").select("*, clients(full_name)").eq("kind", kind).order("due_date", { ascending: false });
      if (error) throw error;
      return data2;
    }
  });
  const togglePaid = useMutation({
    mutationFn: async (t) => {
      const { error } = await supabase.from("transactions").update({ paid_at: t.paid_at ? null : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }).eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removido");
      qc.invalidateQueries({ queryKey: ["transactions"] });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (v) => {
        setOpen(v);
        if (!v) setEditing(null);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Nova ",
          kind === "receita" ? "receita" : "despesa"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionDialog, { kind, editing, onClose: () => {
          setOpen(false);
          setEditing(null);
        } })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando..." }) : data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Nenhum lançamento." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Descrição" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Categoria" }),
        kind === "receita" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Vencimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Valor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: data.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: t.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: t.category ?? "—" }),
        kind === "receita" && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: t.clients?.full_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: format(/* @__PURE__ */ new Date(t.due_date + "T12:00:00"), "dd/MM/yyyy") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right font-medium " + (kind === "receita" ? "text-emerald-700" : "text-rose-700"), children: currency(Number(t.amount)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: t.paid_at ? "default" : "secondary", children: t.paid_at ? "Pago" : "Em aberto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => togglePaid.mutate(t), title: t.paid_at ? "Marcar como aberto" : "Marcar como pago", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
            setEditing(t);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
            if (confirm("Excluir?")) del.mutate(t.id);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-600" }) })
        ] }) })
      ] }, t.id)) })
    ] }) }) })
  ] });
}
function TransactionDialog({
  kind,
  editing,
  onClose
}) {
  const qc = useQueryClient();
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [form, setForm] = reactExports.useState({
    description: editing?.description ?? "",
    category: editing?.category ?? "",
    amount: editing?.amount?.toString() ?? "",
    due_date: editing?.due_date ?? today,
    paid: !!editing?.paid_at,
    client_id: editing?.client_id ?? "",
    notes: editing?.notes ?? ""
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients", "select"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, full_name").order("full_name");
      return data ?? [];
    },
    enabled: kind === "receita"
  });
  const mut = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão expirada");
      const payload = {
        user_id: userData.user.id,
        kind,
        description: form.description,
        category: form.category || null,
        amount: Number(form.amount),
        due_date: form.due_date,
        paid_at: form.paid ? editing?.paid_at ?? today : null,
        client_id: form.client_id || null,
        notes: form.notes || null
      };
      if (editing) {
        const { error } = await supabase.from("transactions").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("transactions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvo!");
      qc.invalidateQueries({ queryKey: ["transactions"] });
      onClose();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
      editing ? "Editar" : "Nova",
      " ",
      kind === "receita" ? "receita" : "despesa"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      mut.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Descrição *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Categoria" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), placeholder: "Ex: Sessão, Aluguel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valor (R$) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: "number", step: "0.01", value: form.amount, onChange: (e) => setForm({ ...form, amount: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Vencimento *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: "date", value: form.due_date, onChange: (e) => setForm({ ...form, due_date: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.paid ? "pago" : "aberto", onValueChange: (v) => setForm({ ...form, paid: v === "pago" }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "aberto", children: "Em aberto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pago", children: "Pago" })
            ] })
          ] })
        ] }),
        kind === "receita" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cliente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.client_id || "none", onValueChange: (v) => setForm({ ...form, client_id: v === "none" ? "" : v }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecionar..." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— Nenhum —" }),
              clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.full_name }, c.id))
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Salvar" })
      ] })
    ] })
  ] });
}
export {
  TransactionsPage as T
};
