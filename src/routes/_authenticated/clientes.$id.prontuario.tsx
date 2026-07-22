import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Plus, Save, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clientes/$id/prontuario")({
  component: ProntuarioPage,
});

type SessionRow = {
  id: string;
  client_id: string;
  scheduled_at: string;
  duration_min: number;
  status: "agendada" | "realizada" | "faltou" | "cancelada";
  notes: string | null;
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

function ProntuarioPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["prontuario-sessions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("id, client_id, scheduled_at, duration_min, status, notes")
        .eq("client_id", id)
        .order("scheduled_at", { ascending: false });
      if (error) throw error;
      return data as SessionRow[];
    },
  });

  const totals = useMemo(() => {
    const realized = sessions.filter((s) => s.status === "realizada").length;
    const withNote = sessions.filter((s) => (s.notes ?? "").trim().length > 0).length;
    return { total: sessions.length, realized, withNote };
  }, [sessions]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Sessões registradas" value={String(totals.total)} />
        <Stat label="Realizadas" value={String(totals.realized)} />
        <Stat label="Com evolução escrita" value={String(totals.withNote)} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" /> Prontuário por sessão
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setQuickOpen((v) => !v)}>
            <Plus className="h-4 w-4 mr-1" /> Registro rápido
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickOpen && <QuickEntry clientId={id} onDone={() => setQuickOpen(false)} />}

          {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {!isLoading && sessions.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhuma sessão registrada. Agende sessões ou use "Registro rápido" para lançar um atendimento retroativo.
            </p>
          )}

          <div className="divide-y">
            {sessions.map((s) => {
              const open = openId === s.id;
              const dt = new Date(s.scheduled_at);
              return (
                <div key={s.id} className="py-3">
                  <button
                    className="w-full flex items-center gap-3 text-left"
                    onClick={() => setOpenId(open ? null : s.id)}
                  >
                    {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">
                        {dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}{" "}
                        <span className="text-muted-foreground font-normal">
                          · {dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · {s.duration_min}min
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={STATUS_STYLE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                    {(s.notes ?? "").trim().length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">com nota</Badge>
                    )}
                  </button>
                  {open && <EvolutionEditor session={s} />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function Stat({ label, value }: { label: string; value: string }) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-display font-bold">{value}</div>
        </CardContent>
      </Card>
    );
  }
}

function EvolutionEditor({ session }: { session: SessionRow }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(session.notes ?? "");
  const [status, setStatus] = useState<SessionRow["status"]>(session.status);

  useEffect(() => {
    setNotes(session.notes ?? "");
    setStatus(session.status);
  }, [session.id]);

  const mut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("sessions")
        .update({ notes: notes || null, status })
        .eq("id", session.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evolução salva");
      qc.invalidateQueries({ queryKey: ["prontuario-sessions"] });
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="mt-3 ml-7 space-y-3">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(STATUS_LABEL) as SessionRow["status"][]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-md text-xs border transition ${
              status === s ? STATUS_STYLE[s] + " font-semibold" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      <Textarea
        rows={6}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Evolução clínica, queixas relatadas, intervenções, tarefas de casa, observações..."
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={() => mut.mutate()} disabled={mut.isPending}>
          <Save className="h-4 w-4 mr-1" /> Salvar evolução
        </Button>
      </div>
    </div>
  );
}

function QuickEntry({ clientId, onDone }: { clientId: string; onDone: () => void }) {
  const qc = useQueryClient();
  const now = new Date();
  now.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  const localDefault = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [when, setWhen] = useState(localDefault);
  const [duration, setDuration] = useState("50");
  const [notes, setNotes] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const { error } = await supabase.from("sessions").insert({
        user_id: u.user.id,
        client_id: clientId,
        scheduled_at: new Date(when).toISOString(),
        duration_min: Number(duration) || 50,
        status: "realizada",
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro adicionado");
      qc.invalidateQueries({ queryKey: ["prontuario-sessions"] });
      qc.invalidateQueries({ queryKey: ["sessions"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="rounded-lg border p-3 space-y-3 bg-muted/30">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Data e hora</Label>
          <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Duração (min)</Label>
          <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
      </div>
      <Textarea
        rows={4}
        placeholder="Evolução da sessão..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onDone}>Cancelar</Button>
        <Button size="sm" onClick={() => mut.mutate()} disabled={mut.isPending}>Salvar registro</Button>
      </div>
    </div>
  );
}
