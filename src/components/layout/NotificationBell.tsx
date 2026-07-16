import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Notif = {
  id: string;
  title: string;
  description: string;
  to: string;
  date?: string;
};

async function buildNotifications(): Promise<Notif[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];

  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const [sessionsRes, txsRes] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, scheduled_at, client_id, status, clients(full_name)")
      .gte("scheduled_at", now.toISOString())
      .lt("scheduled_at", in48h.toISOString())
      .eq("status", "agendada")
      .order("scheduled_at")
      .limit(10),
    supabase
      .from("transactions")
      .select("id, description, due_date, amount, paid_at, kind")
      .is("paid_at", null)
      .lte("due_date", new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
      .order("due_date")
      .limit(10),
  ]);

  const notifs: Notif[] = [];

  (sessionsRes.data ?? []).forEach((s: any) => {
    const dt = new Date(s.scheduled_at);
    notifs.push({
      id: `s-${s.id}`,
      title: `Sessão: ${s.clients?.full_name ?? "Cliente"}`,
      description: dt.toLocaleString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      to: "/agenda",
      date: s.scheduled_at,
    });
  });

  (txsRes.data ?? []).forEach((t: any) => {
    notifs.push({
      id: `t-${t.id}`,
      title: t.kind === "receita" ? `A receber: ${t.description}` : `A pagar: ${t.description}`,
      description: `Vence em ${new Date(t.due_date).toLocaleDateString("pt-BR")} · R$ ${Number(t.amount).toFixed(2)}`,
      to: "/financeiro",
    });
  });

  return notifs;
}

export function NotificationBell() {
  const { data: notifs = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: buildNotifications,
    refetchInterval: 5 * 60 * 1000,
  });

  const count = notifs.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold grid place-items-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b">
          <div className="font-display font-semibold">Notificações</div>
          <div className="text-xs text-muted-foreground">Próximas 48h e pendências</div>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y">
          {notifs.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">Sem notificações.</div>
          )}
          {notifs.map((n) => (
            <Link
              key={n.id}
              to={n.to as "/agenda"}
              className="block p-3 hover:bg-muted/50 transition"
            >
              <div className="font-medium text-sm">{n.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{n.description}</div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
