import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { a as adminCreatePsychologist, b as adminSetPassword, c as adminDeleteUser } from "./admin-actions-lkQflZiL.mjs";
import { l as logAudit } from "./audit-C4hqcqA9.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, f as DialogDescription, d as DialogFooter } from "./dialog-zjtn0avr.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-DteJ2TLP.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2, S as Separator2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2, L as Label2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { l as Plus, z as Search, M as EllipsisVertical, N as Eye, O as KeyRound, j as CircleCheck, Q as Ban, J as Power, R as ShieldPlus, K as ShieldMinus, T as Trash2, q as ChevronRight, s as Check, V as Circle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/tailwind-merge.mjs";
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
function PsychologistsPage() {
  const [q, setQ] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("todos");
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [details, setDetails] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [resetting, setResetting] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(null);
  const qc = useQueryClient();
  const {
    data: rows = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-psychologists"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("admin_psychologists").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const filtered = rows.filter((r) => {
    const matchesQ = r.full_name?.toLowerCase().includes(q.toLowerCase()) || r.email?.toLowerCase().includes(q.toLowerCase()) || r.cpf?.includes(q);
    const matchesStatus = statusFilter === "todos" || statusFilter === "ativos" && r.is_active && !r.is_blocked || statusFilter === "bloqueados" && r.is_blocked;
    return (q === "" || matchesQ) && matchesStatus;
  });
  const invalidate = () => qc.invalidateQueries({
    queryKey: ["admin-psychologists"]
  });
  const toggleFlag = useMutation({
    mutationFn: async ({
      id,
      field,
      value
    }) => {
      const {
        error
      } = await supabase.from("profiles").update({
        [field]: value
      }).eq("id", id);
      if (error) throw error;
      await logAudit({
        action: field === "is_blocked" ? value ? "block" : "unblock" : value ? "activate" : "deactivate",
        entity: "profiles",
        entityId: id
      });
    },
    onSuccess: () => {
      toast.success("Atualizado.");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const toggleAdmin = useMutation({
    mutationFn: async ({
      id,
      makeAdmin
    }) => {
      if (makeAdmin) {
        const {
          error
        } = await supabase.from("user_roles").insert({
          user_id: id,
          role: "admin"
        });
        if (error && !error.message.includes("duplicate")) throw error;
      } else {
        const {
          error
        } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "admin");
        if (error) throw error;
      }
      await logAudit({
        action: "role_change",
        entity: "user_roles",
        entityId: id,
        details: {
          admin: makeAdmin
        }
      });
    },
    onSuccess: () => {
      toast.success("Permissões atualizadas.");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      await adminDeleteUser({
        data: {
          userId: id
        }
      });
      await logAudit({
        action: "delete",
        entity: "auth.users",
        entityId: id
      });
    },
    onSuccess: () => {
      toast.success("Psicólogo excluído.");
      setDeleting(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message.includes("service_role") || e.message.includes("SERVICE_ROLE") ? "Exclusão requer a chave service_role configurada no servidor." : e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Psicólogos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Gerencie os profissionais cadastrados na plataforma." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Novo psicólogo"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreateDialog, { onClose: () => setCreateOpen(false), onDone: invalidate })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[220px] max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Buscar por nome, e-mail ou CPF", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border overflow-hidden", children: ["todos", "ativos", "bloqueados"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatusFilter(s), className: `px-3 py-2 text-xs font-medium capitalize transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`, children: s }, s)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Nenhum psicólogo encontrado." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "E-mail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-center", children: "Clientes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Último acesso" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-medium text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: r.full_name || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: r.email || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: r.client_count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: r.last_sign_in_at ? format(new Date(r.last_sign_in_at), "dd/MM/yyyy HH:mm") : "Nunca" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: r.is_blocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Bloqueado" }) : r.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-600 hover:bg-emerald-600", children: "Ativo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Inativo" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setDetails(r), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-2" }),
              "Ver detalhes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setEditing(r), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4 mr-2" }),
              "Editar dados"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            r.is_blocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => toggleFlag.mutate({
              id: r.id,
              field: "is_blocked",
              value: false
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
              "Desbloquear"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => toggleFlag.mutate({
              id: r.id,
              field: "is_blocked",
              value: true
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4 mr-2" }),
              "Bloquear"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => toggleFlag.mutate({
              id: r.id,
              field: "is_active",
              value: !r.is_active
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4 mr-2" }),
              r.is_active ? "Desativar" : "Ativar"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setResetting(r), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4 mr-2" }),
              "Redefinir senha"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => toggleAdmin.mutate({
              id: r.id,
              makeAdmin: true
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldPlus, { className: "h-4 w-4 mr-2" }),
              "Promover a admin"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => toggleAdmin.mutate({
              id: r.id,
              makeAdmin: false
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldMinus, { className: "h-4 w-4 mr-2" }),
              "Remover admin"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "text-rose-600", onClick: () => setDeleting(r), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
              "Excluir"
            ] })
          ] })
        ] }) })
      ] }, r.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!details, onOpenChange: (v) => !v && setDetails(null), children: details && /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: details.full_name || "Psicólogo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Detalhes do profissional" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "E-mail", value: details.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "CPF", value: details.cpf }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Telefone", value: details.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Clientes cadastrados", value: String(details.client_count) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Cadastrado em", value: format(new Date(details.created_at), "dd/MM/yyyy") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Último acesso", value: details.last_sign_in_at ? format(new Date(details.last_sign_in_at), "dd/MM/yyyy HH:mm") : "Nunca" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Situação", value: details.is_blocked ? "Bloqueado" : details.is_active ? "Ativo" : "Inativo" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: editing && /* @__PURE__ */ jsxRuntimeExports.jsx(EditDialog, { row: editing, onClose: () => setEditing(null), onDone: invalidate }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!resetting, onOpenChange: (v) => !v && setResetting(null), children: resetting && /* @__PURE__ */ jsxRuntimeExports.jsx(ResetPasswordDialog, { row: resetting, onClose: () => setResetting(null) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleting, onOpenChange: (v) => !v && setDeleting(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir psicólogo?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Esta ação remove permanentemente ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleting?.full_name || deleting?.email }),
          " e todos os dados associados (clientes, sessões, financeiro). Não pode ser desfeita."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-rose-600 hover:bg-rose-700", onClick: () => deleting && del.mutate(deleting.id), disabled: del.isPending, children: "Excluir definitivamente" })
      ] })
    ] }) })
  ] });
}
function DetailRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4 border-b py-1.5 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-right", children: value || "—" })
  ] });
}
function CreateDialog({
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
      await adminCreatePsychologist({
        data: form
      });
      await logAudit({
        action: "insert",
        entity: "auth.users",
        details: {
          email: form.email
        }
      });
    },
    onSuccess: () => {
      toast.success("Psicólogo criado!");
      onDone();
      onClose();
    },
    onError: (e) => toast.error(e.message.includes("service_role") || e.message.includes("SERVICE_ROLE") ? "Criação requer a chave service_role configurada no servidor." : e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Novo psicólogo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "A conta é criada já confirmada e pronta para uso." })
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
function EditDialog({
  row,
  onClose,
  onDone
}) {
  const [form, setForm] = reactExports.useState({
    full_name: row.full_name ?? "",
    cpf: row.cpf ?? "",
    phone: row.phone ?? ""
  });
  const mut = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("profiles").update({
        full_name: form.full_name || null,
        cpf: form.cpf || null,
        phone: form.phone || null
      }).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dados atualizados.");
      onDone();
      onClose();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Editar psicólogo" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      mut.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome completo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.full_name, onChange: (e) => setForm({
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
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Salvar" })
      ] })
    ] })
  ] });
}
function ResetPasswordDialog({
  row,
  onClose
}) {
  const [password, setPassword] = reactExports.useState("");
  const setDirect = useMutation({
    mutationFn: async () => {
      await adminSetPassword({
        data: {
          userId: row.id,
          password
        }
      });
      await logAudit({
        action: "password_reset",
        entity: "auth.users",
        entityId: row.id
      });
    },
    onSuccess: () => {
      toast.success("Senha redefinida.");
      onClose();
    },
    onError: (e) => toast.error(e.message.includes("service_role") || e.message.includes("SERVICE_ROLE") ? "Definir senha direto requer service_role. Use o envio por e-mail." : e.message)
  });
  const sendEmail = useMutation({
    mutationFn: async () => {
      if (!row.email) throw new Error("Psicólogo sem e-mail cadastrado.");
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(row.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      await logAudit({
        action: "password_reset",
        entity: "auth.users",
        entityId: row.id,
        details: {
          via: "email"
        }
      });
    },
    onSuccess: () => {
      toast.success("E-mail de redefinição enviado.");
      onClose();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Redefinir senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: row.full_name || row.email })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nova senha (definir diretamente)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Mínimo 6 caracteres" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setDirect.mutate(), disabled: password.length < 6 || setDirect.isPending, children: "Definir" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
        "ou",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", onClick: () => sendEmail.mutate(), disabled: sendEmail.isPending, children: "Enviar e-mail de redefinição" })
    ] })
  ] });
}
export {
  PsychologistsPage as component
};
