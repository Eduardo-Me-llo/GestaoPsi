import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as Route$1 } from "./router-C0lyWhsY.mjs";
import { H as FileText, l as Plus, r as ChevronDown, q as ChevronRight, Y as Save } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
const STATUS_LABEL = {
  agendada: "Agendada",
  realizada: "Realizada",
  faltou: "Faltou",
  cancelada: "Cancelada"
};
const STATUS_STYLE = {
  agendada: "bg-primary/10 text-primary border-primary/30",
  realizada: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  faltou: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  cancelada: "bg-muted text-muted-foreground border-border"
};
function ProntuarioPage() {
  const {
    id
  } = Route$1.useParams();
  useQueryClient();
  const [openId, setOpenId] = reactExports.useState(null);
  const [quickOpen, setQuickOpen] = reactExports.useState(false);
  const {
    data: sessions = [],
    isLoading
  } = useQuery({
    queryKey: ["prontuario-sessions", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sessions").select("id, client_id, scheduled_at, duration_min, status, notes").eq("client_id", id).order("scheduled_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const totals = reactExports.useMemo(() => {
    const realized = sessions.filter((s) => s.status === "realizada").length;
    const withNote = sessions.filter((s) => (s.notes ?? "").trim().length > 0).length;
    return {
      total: sessions.length,
      realized,
      withNote
    };
  }, [sessions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Sessões registradas", value: String(totals.total) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Realizadas", value: String(totals.realized) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Com evolução escrita", value: String(totals.withNote) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }),
          " Prontuário por sessão"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setQuickOpen((v) => !v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " Registro rápido"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        quickOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(QuickEntry, { clientId: id, onDone: () => setQuickOpen(false) }),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Carregando..." }),
        !isLoading && sessions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-6 text-center", children: 'Nenhuma sessão registrada. Agende sessões ou use "Registro rápido" para lançar um atendimento retroativo.' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: sessions.map((s) => {
          const open = openId === s.id;
          const dt = new Date(s.scheduled_at);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full flex items-center gap-3 text-left", onClick: () => setOpenId(open ? null : s.id), children: [
              open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
                dt.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                  "· ",
                  dt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  }),
                  " · ",
                  s.duration_min,
                  "min"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: STATUS_STYLE[s.status], children: STATUS_LABEL[s.status] }),
              (s.notes ?? "").trim().length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: "com nota" })
            ] }),
            open && /* @__PURE__ */ jsxRuntimeExports.jsx(EvolutionEditor, { session: s })
          ] }, s.id);
        }) })
      ] })
    ] })
  ] });
  function Stat({
    label,
    value
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-display font-bold", children: value })
    ] }) });
  }
}
function EvolutionEditor({
  session
}) {
  const qc = useQueryClient();
  const [notes, setNotes] = reactExports.useState(session.notes ?? "");
  const [status, setStatus] = reactExports.useState(session.status);
  reactExports.useEffect(() => {
    setNotes(session.notes ?? "");
    setStatus(session.status);
  }, [session.id]);
  const mut = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("sessions").update({
        notes: notes || null,
        status
      }).eq("id", session.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evolução salva");
      qc.invalidateQueries({
        queryKey: ["prontuario-sessions"]
      });
      qc.invalidateQueries({
        queryKey: ["sessions"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 ml-7 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: Object.keys(STATUS_LABEL).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStatus(s), className: `px-3 py-1 rounded-md text-xs border transition ${status === s ? STATUS_STYLE[s] + " font-semibold" : "border-border text-muted-foreground hover:bg-muted"}`, children: STATUS_LABEL[s] }, s)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 6, value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Evolução clínica, queixas relatadas, intervenções, tarefas de casa, observações..." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => mut.mutate(), disabled: mut.isPending, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1" }),
      " Salvar evolução"
    ] }) })
  ] });
}
function QuickEntry({
  clientId,
  onDone
}) {
  const qc = useQueryClient();
  const now = /* @__PURE__ */ new Date();
  now.setSeconds(0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  const localDefault = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const [when, setWhen] = reactExports.useState(localDefault);
  const [duration, setDuration] = reactExports.useState("50");
  const [notes, setNotes] = reactExports.useState("");
  const mut = useMutation({
    mutationFn: async () => {
      const {
        data: u
      } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const {
        error
      } = await supabase.from("sessions").insert({
        user_id: u.user.id,
        client_id: clientId,
        scheduled_at: new Date(when).toISOString(),
        duration_min: Number(duration) || 50,
        status: "realizada",
        notes: notes || null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro adicionado");
      qc.invalidateQueries({
        queryKey: ["prontuario-sessions"]
      });
      qc.invalidateQueries({
        queryKey: ["sessions"]
      });
      onDone();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-3 space-y-3 bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Data e hora" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: when, onChange: (e) => setWhen(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Duração (min)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: duration, onChange: (e) => setDuration(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, placeholder: "Evolução da sessão...", value: notes, onChange: (e) => setNotes(e.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: onDone, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => mut.mutate(), disabled: mut.isPending, children: "Salvar registro" })
    ] })
  ] });
}
export {
  ProntuarioPage as component
};
