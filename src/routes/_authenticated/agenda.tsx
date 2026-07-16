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
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
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
  agendada: "bg-primary/10 text-primary border-primary/30",
  realizada: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  faltou: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  cancelada: "bg-muted text-muted-foreground border-border",
};

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0=dom
  x.setDate(x.getDate() - day);
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

function AgendaPage() {
  const qc = useQueryClient();
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date()));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SessionRow | null>(null);

  const { data: prefs } = useQuery({
    queryKey: ["prefs"],
    queryFn: loadPrefs,
  });
  const agendaCfg = { ...DEFAULT_AGENDA, ...(prefs?.agenda ?? {}) };

  const weekStart = anchor;
  const weekEnd = addDays(anchor, 7);
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => addDays(anchor, i)).filter(
        (d) => !agendaCfg.hidden_days.includes(d.getDay()),
      ),
    [anchor, agendaCfg.hidden_days.join(",")],
  );

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", weekStart.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .gte("scheduled_at", weekStart.toISOString())
        .lt("scheduled_at", weekEnd.toISOString())
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

  const byDay = (d: Date) =>
    sessions
      .filter((s) => {
        const sd = new Date(s.scheduled_at);
        return sd.toDateString() === d.toDateString();
      })
      .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (s: SessionRow) => {
    setEditing(s);
    setOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground mt-1">Semana de {fmtDate(weekStart)} a {fmtDate(addDays(weekStart, 6))}.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setAnchor(addDays(anchor, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setAnchor(startOfWeek(new Date()))}>Hoje</Button>
          <Button variant="outline" size="icon" onClick={() => setAnchor(addDays(anchor, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Nova sessão</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map((d) => {
          const items = byDay(d);
          const isToday = d.toDateString() === new Date().toDateString();
          return (
            <Card key={d.toISOString()} className={isToday ? "border-primary/50" : ""}>
              <CardContent className="p-3 space-y-2 min-h-[180px]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">{fmtDayName(d)}</div>
                    <div className="font-display text-lg font-semibold">{d.getDate()}</div>
                  </div>
                  {isToday && <Badge variant="secondary">hoje</Badge>}
                </div>
                <div className="space-y-1.5">
                  {items.length === 0 && (
                    <div className="text-xs text-muted-foreground py-2">Sem sessões</div>
                  )}
                  {items.map((s) => {
                    const time = new Date(s.scheduled_at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <button
                        key={s.id}
                        onClick={() => openEdit(s)}
                        className={`w-full text-left rounded-md border p-2 text-xs transition hover:shadow-sm ${STATUS_STYLE[s.status]}`}
                      >
                        <div className="font-semibold">{time} · {s.duration_min}min</div>
                        <div className="truncate">{clientName(s.client_id)}</div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <SessionDialog
        open={open}
        onOpenChange={setOpen}
        session={editing}
        clients={clients}
        onDelete={(id) => deleteMut.mutate(id)}
      />
    </div>
  );
}

function SessionDialog({
  open,
  onOpenChange,
  session,
  clients,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  session: SessionRow | null;
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

  // Reset form when opening
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
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(defaultStartHour);
      if (now < new Date()) now.setDate(now.getDate() + 1);
      setForm({
        client_id: clients[0]?.id ?? "",
        scheduled_at: toLocalInput(now.toISOString()),
        duration_min: String(defaultDuration),
        status: "agendada",
        room: "",
        value: "",
        paid: false,
        notes: "",
      });
    }
  }, [open, session, clients, defaultDuration, defaultStartHour]);

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
