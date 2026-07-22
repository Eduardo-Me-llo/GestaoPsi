import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { loadPrefs, DEFAULT_AGENDA } from "@/lib/user-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Trash2, CalendarDays, CalendarRange } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/agenda")({
  component: AgendaPage,
});

type SessionRow = {
  id: string;
  client_id: string;
  scheduled_at: string;
  duration_min: number;
  status: "agendada" | "realizada" | "faltou" | "cancelada";
  room: string | null;
  notes: string | null;
  value: number | null;
  paid: boolean;
};

const STATUS_LABEL: Record<SessionRow["status"], string> = {
  agendada: "Agendada",
  realizada: "Realizada",
  faltou: "Faltou",
  cancelada: "Cancelada",
};

const STATUS_STYLE: Record<SessionRow["status"], string> = {
  agendada: "bg-primary/15 text-primary border-l-primary",
  realizada: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-l-emerald-500",
  faltou: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-l-amber-500",
  cancelada: "bg-muted text-muted-foreground border-l-border line-through",
};

const SLOT_HEIGHT = 44; // px per 30min
const SNAP_MIN = 30;

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function fmtDayName(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "short" });
}
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function AgendaPage() {
  const qc = useQueryClient();
  const [mode, setMode] = useState<"week" | "day">("week");
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date()));
  const [dayAnchor, setDayAnchor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SessionRow | null>(null);
  const [presetDate, setPresetDate] = useState<Date | null>(null);

  const { data: prefs } = useQuery({ queryKey: ["prefs"], queryFn: loadPrefs });
  const agendaCfg = { ...DEFAULT_AGENDA, ...(prefs?.agenda ?? {}) };

  const rangeStart = mode === "week" ? anchor : dayAnchor;
  const rangeEnd = mode === "week" ? addDays(anchor, 7) : addDays(dayAnchor, 1);

  const allDays = useMemo(() => {
    if (mode === "day") return [dayAnchor];
    return Array.from({ length: 7 }, (_, i) => addDays(anchor, i)).filter(
      (d) => !agendaCfg.hidden_days.includes(d.getDay()),
    );
  }, [mode, anchor, dayAnchor, agendaCfg.hidden_days.join(",")]);

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", rangeStart.toISOString(), rangeEnd.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .gte("scheduled_at", rangeStart.toISOString())
        .lt("scheduled_at", rangeEnd.toISOString())
        .order("scheduled_at");
      if (error) throw error;
      return data as SessionRow[];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, full_name").order("full_name");
      if (error) throw error;
      return data as { id: string; full_name: string }[];
    },
  });

  const clientName = (id: string) => clients.find((c) => c.id === id)?.full_name ?? "—";

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sessions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sessão excluída");
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const openNew = (preset?: Date) => {
    setEditing(null);
    setPresetDate(preset ?? null);
    setOpen(true);
  };
  const openEdit = (s: SessionRow) => {
    setEditing(s);
    setPresetDate(null);
    setOpen(true);
  };

  // Time grid config
  const startHour = agendaCfg.start_hour;
  const endHour = agendaCfg.end_hour;
  const totalSlots = Math.max(1, (endHour - startHour) * 2); // 30-min slots
  const hourMarks = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const goPrev = () => (mode === "week" ? setAnchor(addDays(anchor, -7)) : setDayAnchor(addDays(dayAnchor, -1)));
  const goNext = () => (mode === "week" ? setAnchor(addDays(anchor, 7)) : setDayAnchor(addDays(dayAnchor, 1)));
  const goToday = () => {
    setAnchor(startOfWeek(new Date()));
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setDayAnchor(d);
  };

  // Session totals for the summary
  const totals = useMemo(() => {
    return {
      total: sessions.length,
      agendadas: sessions.filter((s) => s.status === "agendada").length,
      realizadas: sessions.filter((s) => s.status === "realizada").length,
      receita: sessions.filter((s) => s.paid).reduce((sum, s) => sum + Number(s.value ?? 0), 0),
    };
  }, [sessions]);

  const rangeLabel =
    mode === "week"
      ? `Semana de ${fmtDate(anchor)} a ${fmtDate(addDays(anchor, 6))}`
      : dayAnchor.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground mt-1 capitalize">{rangeLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${mode === "week" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              onClick={() => setMode("week")}
            >
              <CalendarRange className="h-4 w-4" /> Semana
            </button>
            <button
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${mode === "day" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              onClick={() => setMode("day")}
            >
              <CalendarDays className="h-4 w-4" /> Dia
            </button>
          </div>
          <Button variant="outline" size="icon" onClick={goPrev}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={goToday}>Hoje</Button>
          <Button variant="outline" size="icon" onClick={goNext}><ChevronRight className="h-4 w-4" /></Button>
          <Button onClick={() => openNew()}><Plus className="h-4 w-4 mr-2" />Nova sessão</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Sessões no período" value={String(totals.total)} />
        <SummaryCard label="Agendadas" value={String(totals.agendadas)} />
        <SummaryCard label="Realizadas" value={String(totals.realizadas)} />
        <SummaryCard label="Recebido" value={totals.receita.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[720px]">
            {/* header row */}
            <div
              className="grid border-b bg-muted/30"
              style={{ gridTemplateColumns: `72px repeat(${allDays.length}, minmax(120px, 1fr))` }}
            >
              <div className="p-2 text-xs text-muted-foreground">Horário</div>
              {allDays.map((d) => {
                const isToday = sameDay(d, new Date());
                return (
                  <div key={d.toISOString()} className={`p-2 text-center border-l ${isToday ? "bg-primary/5" : ""}`}>
                    <div className="text-[11px] uppercase text-muted-foreground tracking-wide">{fmtDayName(d)}</div>
                    <div className="font-display text-lg font-semibold flex items-center justify-center gap-2">
                      {d.getDate()}
                      {isToday && <Badge variant="secondary" className="h-4 text-[10px]">hoje</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* body grid */}
            <div
              className="grid relative"
              style={{ gridTemplateColumns: `72px repeat(${allDays.length}, minmax(120px, 1fr))` }}
            >
              {/* time column */}
              <div className="border-r">
                {hourMarks.slice(0, -1).map((h) => (
                  <div
                    key={h}
                    className="text-xs text-muted-foreground text-right pr-2 pt-1"
                    style={{ height: SLOT_HEIGHT * 2 }}
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* day columns */}
              {allDays.map((day) => (
                <DayColumn
                  key={day.toISOString()}
                  day={day}
                  startHour={startHour}
                  totalSlots={totalSlots}
                  sessions={sessions.filter((s) => sameDay(new Date(s.scheduled_at), day))}
                  onSlotClick={(dt) => openNew(dt)}
                  onSessionClick={openEdit}
                  clientName={clientName}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <SessionDialog
        open={open}
        onOpenChange={setOpen}
        session={editing}
        presetDate={presetDate}
        clients={clients}
        onDelete={(id) => deleteMut.mutate(id)}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="text-[11px] uppercase text-muted-foreground tracking-wide">{label}</div>
        <div className="text-xl font-display font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DayColumn({
  day,
  startHour,
  totalSlots,
  sessions,
  onSlotClick,
  onSessionClick,
  clientName,
}: {
  day: Date;
  startHour: number;
  totalSlots: number;
  sessions: SessionRow[];
  onSlotClick: (dt: Date) => void;
  onSessionClick: (s: SessionRow) => void;
  clientName: (id: string) => string;
}) {
  const isToday = sameDay(day, new Date());
  const nowMinutes = isToday ? new Date().getHours() * 60 + new Date().getMinutes() : null;
  const startMin = startHour * 60;
  const totalMin = totalSlots * SNAP_MIN;
  const nowTop = nowMinutes != null && nowMinutes >= startMin && nowMinutes < startMin + totalMin
    ? ((nowMinutes - startMin) / SNAP_MIN) * SLOT_HEIGHT
    : null;

  return (
    <div className={`relative border-l ${isToday ? "bg-primary/5" : ""}`}>
      {/* click slots */}
      {Array.from({ length: totalSlots }, (_, i) => {
        const slotMin = startMin + i * SNAP_MIN;
        const dt = new Date(day);
        dt.setHours(Math.floor(slotMin / 60), slotMin % 60, 0, 0);
        return (
          <button
            key={i}
            onClick={() => onSlotClick(dt)}
            className={`block w-full border-b border-dashed border-border/50 hover:bg-primary/10 transition ${i % 2 === 1 ? "border-b-border" : ""}`}
            style={{ height: SLOT_HEIGHT }}
            aria-label={`Adicionar às ${String(Math.floor(slotMin / 60)).padStart(2, "0")}:${String(slotMin % 60).padStart(2, "0")}`}
          />
        );
      })}

      {/* now indicator */}
      {nowTop != null && (
        <div
          className="absolute left-0 right-0 h-[2px] bg-red-500 z-10 pointer-events-none"
          style={{ top: nowTop }}
        >
          <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </div>
      )}

      {/* session blocks */}
      {sessions.map((s) => {
        const sd = new Date(s.scheduled_at);
        const sMin = sd.getHours() * 60 + sd.getMinutes();
        const top = ((sMin - startMin) / SNAP_MIN) * SLOT_HEIGHT;
        const height = Math.max((s.duration_min / SNAP_MIN) * SLOT_HEIGHT - 2, 24);
        if (top + height < 0 || top > totalSlots * SLOT_HEIGHT) return null;
        const time = sd.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        return (
          <button
            key={s.id}
            onClick={() => onSessionClick(s)}
            className={`absolute left-1 right-1 rounded-md border-l-4 border border-border/60 p-1.5 text-left text-xs shadow-sm hover:shadow-md hover:z-20 transition overflow-hidden ${STATUS_STYLE[s.status]}`}
            style={{ top: Math.max(top, 0), height }}
          >
            <div className="font-semibold truncate">{time} · {s.duration_min}min</div>
            <div className="truncate">{clientName(s.client_id)}</div>
            {s.room && height > 60 && <div className="truncate opacity-70">{s.room}</div>}
          </button>
        );
      })}
    </div>
  );
}

function SessionDialog({
  open,
  onOpenChange,
  session,
  presetDate,
  clients,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  session: SessionRow | null;
  presetDate: Date | null;
  clients: { id: string; full_name: string }[];
  onDelete: (id: string) => void;
}) {
  const qc = useQueryClient();
  const { data: prefs } = useQuery({ queryKey: ["prefs"], queryFn: loadPrefs });
  const defaultDuration = prefs?.agenda?.session_duration ?? DEFAULT_AGENDA.session_duration;
  const defaultStartHour = prefs?.agenda?.start_hour ?? DEFAULT_AGENDA.start_hour;

  const [form, setForm] = useState({
    client_id: "",
    scheduled_at: "",
    duration_min: String(defaultDuration),
    status: "agendada" as SessionRow["status"],
    room: "",
    value: "",
    paid: false,
    notes: "",
  });

  useMemo(() => {
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
        notes: session.notes ?? "",
      });
    } else {
      const base = presetDate ? new Date(presetDate) : (() => {
        const n = new Date();
        n.setMinutes(0, 0, 0);
        n.setHours(defaultStartHour);
        if (n < new Date()) n.setDate(n.getDate() + 1);
        return n;
      })();
      setForm({
        client_id: clients[0]?.id ?? "",
        scheduled_at: toLocalInput(base.toISOString()),
        duration_min: String(defaultDuration),
        status: "agendada",
        room: "",
        value: prefs && (prefs as any).default_value ? String((prefs as any).default_value) : "",
        paid: false,
        notes: "",
      });
    }
  }, [open, session, presetDate, clients, defaultDuration, defaultStartHour]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form.client_id) throw new Error("Selecione um cliente");
      if (!form.scheduled_at) throw new Error("Informe a data/hora");
      const { data: userData } = await supabase.auth.getUser();
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
        notes: form.notes || null,
      };
      if (session) {
        const { error } = await supabase.from("sessions").update(payload).eq("id", session.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sessions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(session ? "Sessão atualizada" : "Sessão criada");
      qc.invalidateQueries({ queryKey: ["sessions"] });
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao salvar"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{session ? "Editar sessão" : "Nova sessão"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Data e hora *</Label>
              <Input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Duração (min)</Label>
              <Input
                type="number"
                min={10}
                value={form.duration_min}
                onChange={(e) => setForm({ ...form, duration_min: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Situação</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as SessionRow["status"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABEL) as SessionRow["status"][]).map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sala / local</Label>
              <Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={form.paid}
                  onChange={(e) => setForm({ ...form, paid: e.target.checked })}
                />
                Pago
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <div>
              {session && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    onDelete(session.id);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Excluir
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={save.isPending}>Salvar</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
