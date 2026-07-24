import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { l as loadPrefs, D as DEFAULT_AGENDA } from "./user-settings-CQlX_81E.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-zjtn0avr.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as CalendarRange, o as CalendarDays, p as ChevronLeft, q as ChevronRight, l as Plus, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const STATUS_LABEL = {
  agendada: "Agendada",
  realizada: "Realizada",
  faltou: "Faltou",
  cancelada: "Cancelada"
};
const STATUS_STYLE = {
  agendada: "bg-primary/15 text-primary border-l-primary",
  realizada: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-l-emerald-500",
  faltou: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-l-amber-500",
  cancelada: "bg-muted text-muted-foreground border-l-border line-through"
};
const SLOT_HEIGHT = 44;
const SNAP_MIN = 30;
function startOfWeek(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmtDate(d) {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  });
}
function fmtDayName(d) {
  return d.toLocaleDateString("pt-BR", {
    weekday: "short"
  });
}
function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function AgendaPage() {
  const qc = useQueryClient();
  const [mode, setMode] = reactExports.useState("week");
  const [anchor, setAnchor] = reactExports.useState(() => startOfWeek(/* @__PURE__ */ new Date()));
  const [dayAnchor, setDayAnchor] = reactExports.useState(() => {
    const d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [presetDate, setPresetDate] = reactExports.useState(null);
  const {
    data: prefs
  } = useQuery({
    queryKey: ["prefs"],
    queryFn: loadPrefs
  });
  const agendaCfg = {
    ...DEFAULT_AGENDA,
    ...prefs?.agenda ?? {}
  };
  const rangeStart = mode === "week" ? anchor : dayAnchor;
  const rangeEnd = mode === "week" ? addDays(anchor, 7) : addDays(dayAnchor, 1);
  const allDays = reactExports.useMemo(() => {
    if (mode === "day") return [dayAnchor];
    return Array.from({
      length: 7
    }, (_, i) => addDays(anchor, i)).filter((d) => !agendaCfg.hidden_days.includes(d.getDay()));
  }, [mode, anchor, dayAnchor, agendaCfg.hidden_days.join(",")]);
  const {
    data: sessions = []
  } = useQuery({
    queryKey: ["sessions", rangeStart.toISOString(), rangeEnd.toISOString()],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sessions").select("*").gte("scheduled_at", rangeStart.toISOString()).lt("scheduled_at", rangeEnd.toISOString()).order("scheduled_at");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: clients = []
  } = useQuery({
    queryKey: ["clients", "options"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("clients").select("id, full_name").order("full_name");
      if (error) throw error;
      return data;
    }
  });
  const clientName = (id) => clients.find((c) => c.id === id)?.full_name ?? "—";
  const deleteMut = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("sessions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sessão excluída");
      qc.invalidateQueries({
        queryKey: ["sessions"]
      });
    }
  });
  const openNew = (preset) => {
    setEditing(null);
    setPresetDate(preset ?? null);
    setOpen(true);
  };
  const openEdit = (s) => {
    setEditing(s);
    setPresetDate(null);
    setOpen(true);
  };
  const startHour = agendaCfg.start_hour;
  const endHour = agendaCfg.end_hour;
  const totalSlots = Math.max(1, (endHour - startHour) * 2);
  const hourMarks = Array.from({
    length: endHour - startHour + 1
  }, (_, i) => startHour + i);
  const goPrev = () => mode === "week" ? setAnchor(addDays(anchor, -7)) : setDayAnchor(addDays(dayAnchor, -1));
  const goNext = () => mode === "week" ? setAnchor(addDays(anchor, 7)) : setDayAnchor(addDays(dayAnchor, 1));
  const goToday = () => {
    setAnchor(startOfWeek(/* @__PURE__ */ new Date()));
    const d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    setDayAnchor(d);
  };
  const totals = reactExports.useMemo(() => {
    return {
      total: sessions.length,
      agendadas: sessions.filter((s) => s.status === "agendada").length,
      realizadas: sessions.filter((s) => s.status === "realizada").length,
      receita: sessions.filter((s) => s.paid).reduce((sum, s) => sum + Number(s.value ?? 0), 0)
    };
  }, [sessions]);
  const rangeLabel = mode === "week" ? `Semana de ${fmtDate(anchor)} a ${fmtDate(addDays(anchor, 6))}` : dayAnchor.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-[1400px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Agenda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 capitalize", children: rangeLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-md border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `px-3 py-1.5 text-sm flex items-center gap-1.5 ${mode === "week" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`, onClick: () => setMode("week"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-4 w-4" }),
            " Semana"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `px-3 py-1.5 text-sm flex items-center gap-1.5 ${mode === "day" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`, onClick: () => setMode("day"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4" }),
            " Dia"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: goPrev, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: goToday, children: "Hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: goNext, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openNew(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Nova sessão"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Sessões no período", value: String(totals.total) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Agendadas", value: String(totals.agendadas) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Realizadas", value: String(totals.realizadas) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Recebido", value: totals.receita.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[720px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid border-b bg-muted/30", style: {
        gridTemplateColumns: `72px repeat(${allDays.length}, minmax(120px, 1fr))`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 text-xs text-muted-foreground", children: "Horário" }),
        allDays.map((d) => {
          const isToday = sameDay(d, /* @__PURE__ */ new Date());
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-2 text-center border-l ${isToday ? "bg-primary/5" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase text-muted-foreground tracking-wide", children: fmtDayName(d) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg font-semibold flex items-center justify-center gap-2", children: [
              d.getDate(),
              isToday && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "h-4 text-[10px]", children: "hoje" })
            ] })
          ] }, d.toISOString());
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid relative", style: {
        gridTemplateColumns: `72px repeat(${allDays.length}, minmax(120px, 1fr))`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-r", children: hourMarks.slice(0, -1).map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground text-right pr-2 pt-1", style: {
          height: SLOT_HEIGHT * 2
        }, children: [
          String(h).padStart(2, "0"),
          ":00"
        ] }, h)) }),
        allDays.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx(DayColumn, { day, startHour, totalSlots, sessions: sessions.filter((s) => sameDay(new Date(s.scheduled_at), day)), onSlotClick: (dt) => openNew(dt), onSessionClick: openEdit, clientName }, day.toISOString()))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SessionDialog, { open, onOpenChange: setOpen, session: editing, presetDate, clients, onDelete: (id) => deleteMut.mutate(id) })
  ] });
}
function SummaryCard({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase text-muted-foreground tracking-wide", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-display font-bold", children: value })
  ] }) });
}
function DayColumn({
  day,
  startHour,
  totalSlots,
  sessions,
  onSlotClick,
  onSessionClick,
  clientName
}) {
  const isToday = sameDay(day, /* @__PURE__ */ new Date());
  const nowMinutes = isToday ? (/* @__PURE__ */ new Date()).getHours() * 60 + (/* @__PURE__ */ new Date()).getMinutes() : null;
  const startMin = startHour * 60;
  const totalMin = totalSlots * SNAP_MIN;
  const nowTop = nowMinutes != null && nowMinutes >= startMin && nowMinutes < startMin + totalMin ? (nowMinutes - startMin) / SNAP_MIN * SLOT_HEIGHT : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative border-l ${isToday ? "bg-primary/5" : ""}`, children: [
    Array.from({
      length: totalSlots
    }, (_, i) => {
      const slotMin = startMin + i * SNAP_MIN;
      const dt = new Date(day);
      dt.setHours(Math.floor(slotMin / 60), slotMin % 60, 0, 0);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSlotClick(dt), className: `block w-full border-b border-dashed border-border/50 hover:bg-primary/10 transition ${i % 2 === 1 ? "border-b-border" : ""}`, style: {
        height: SLOT_HEIGHT
      }, "aria-label": `Adicionar às ${String(Math.floor(slotMin / 60)).padStart(2, "0")}:${String(slotMin % 60).padStart(2, "0")}` }, i);
    }),
    nowTop != null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 h-[2px] bg-red-500 z-10 pointer-events-none", style: {
      top: nowTop
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-500" }) }),
    sessions.map((s) => {
      const sd = new Date(s.scheduled_at);
      const sMin = sd.getHours() * 60 + sd.getMinutes();
      const top = (sMin - startMin) / SNAP_MIN * SLOT_HEIGHT;
      const height = Math.max(s.duration_min / SNAP_MIN * SLOT_HEIGHT - 2, 24);
      if (top + height < 0 || top > totalSlots * SLOT_HEIGHT) return null;
      const time = sd.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSessionClick(s), className: `absolute left-1 right-1 rounded-md border-l-4 border border-border/60 p-1.5 text-left text-xs shadow-sm hover:shadow-md hover:z-20 transition overflow-hidden ${STATUS_STYLE[s.status]}`, style: {
        top: Math.max(top, 0),
        height
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold truncate", children: [
          time,
          " · ",
          s.duration_min,
          "min"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: clientName(s.client_id) }),
        s.room && height > 60 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate opacity-70", children: s.room })
      ] }, s.id);
    })
  ] });
}
function SessionDialog({
  open,
  onOpenChange,
  session,
  presetDate,
  clients,
  onDelete
}) {
  const qc = useQueryClient();
  const {
    data: prefs
  } = useQuery({
    queryKey: ["prefs"],
    queryFn: loadPrefs
  });
  const defaultDuration = prefs?.agenda?.session_duration ?? DEFAULT_AGENDA.session_duration;
  const defaultStartHour = prefs?.agenda?.start_hour ?? DEFAULT_AGENDA.start_hour;
  const [form, setForm] = reactExports.useState({
    client_id: "",
    scheduled_at: "",
    duration_min: String(defaultDuration),
    status: "agendada",
    room: "",
    value: "",
    paid: false,
    notes: ""
  });
  reactExports.useMemo(() => {
    if (!open) return;
    if (session) {
      setForm({
        client_id: session.client_id,
        scheduled_at: toLocalInput(session.scheduled_at),
        duration_min: String(session.duration_min),
        status: session.status,
        room: session.room ?? "",
        value: session.value != null ? String(session.value) : "",
        paid: session.paid,
        notes: session.notes ?? ""
      });
    } else {
      const base = presetDate ? new Date(presetDate) : (() => {
        const n = /* @__PURE__ */ new Date();
        n.setMinutes(0, 0, 0);
        n.setHours(defaultStartHour);
        if (n < /* @__PURE__ */ new Date()) n.setDate(n.getDate() + 1);
        return n;
      })();
      setForm({
        client_id: clients[0]?.id ?? "",
        scheduled_at: toLocalInput(base.toISOString()),
        duration_min: String(defaultDuration),
        status: "agendada",
        room: "",
        value: prefs && prefs.default_value ? String(prefs.default_value) : "",
        paid: false,
        notes: ""
      });
    }
  }, [open, session, presetDate, clients, defaultDuration, defaultStartHour]);
  const save = useMutation({
    mutationFn: async () => {
      if (!form.client_id) throw new Error("Selecione um cliente");
      if (!form.scheduled_at) throw new Error("Informe a data/hora");
      const {
        data: userData
      } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão expirada");
      const payload = {
        user_id: userData.user.id,
        client_id: form.client_id,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        duration_min: Number(form.duration_min) || 50,
        status: form.status,
        room: form.room || null,
        value: form.value ? Number(form.value) : null,
        paid: form.paid,
        notes: form.notes || null
      };
      if (session) {
        const {
          error
        } = await supabase.from("sessions").update(payload).eq("id", session.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("sessions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(session ? "Sessão atualizada" : "Sessão criada");
      qc.invalidateQueries({
        queryKey: ["sessions"]
      });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message ?? "Erro ao salvar")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: session ? "Editar sessão" : "Nova sessão" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      save.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cliente *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.client_id, onValueChange: (v) => setForm({
          ...form,
          client_id: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um cliente" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.full_name }, c.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Data e hora *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: form.scheduled_at, onChange: (e) => setForm({
            ...form,
            scheduled_at: e.target.value
          }), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duração (min)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 10, value: form.duration_min, onChange: (e) => setForm({
            ...form,
            duration_min: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Situação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.status, onValueChange: (v) => setForm({
            ...form,
            status: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.keys(STATUS_LABEL).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: STATUS_LABEL[s] }, s)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sala / local" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.room, onChange: (e) => setForm({
            ...form,
            room: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valor (R$)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: form.value, onChange: (e) => setForm({
            ...form,
            value: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "h-4 w-4", checked: form.paid, onChange: (e) => setForm({
            ...form,
            paid: e.target.checked
          }) }),
          "Pago"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: form.notes, onChange: (e) => setForm({
          ...form,
          notes: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: session && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", className: "text-destructive hover:text-destructive", onClick: () => {
          onDelete(session.id);
          onOpenChange(false);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1" }),
          " Excluir"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: save.isPending, children: "Salvar" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  AgendaPage as component
};
