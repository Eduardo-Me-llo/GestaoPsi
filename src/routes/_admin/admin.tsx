import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Users,
  CalendarCheck,
  UserCheck,
  TrendingUp,
  Activity,
  ScrollText,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_admin/admin")({
  component: AdminDashboard,
});

type Stats = {
  psychologists: number;
  clients: number;
  sessionsDone: number;
  activeUsers: number;
  newThisMonth: number;
  growth: { month: string; psicologos: number; clientes: number }[];
  recentProfiles: { id: string; full_name: string | null; created_at: string }[];
  recentAudit: {
    id: string;
    action: string;
    entity: string | null;
    actor_email: string | null;
    created_at: string;
  }[];
};

function AdminDashboard() {
  const { data, isLoading } = useQuery<Stats>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [
        psychRes,
        clientsRes,
        sessionsRes,
        activeRes,
        profilesRes,
        auditRes,
      ] = await Promise.all([
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "psicologo"),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("sessions").select("id", { count: "exact", head: true }).eq("status", "realizada"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_active", true).eq("is_blocked", false),
        supabase.from("profiles").select("id, full_name, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("audit_logs").select("id, action, entity, actor_email, created_at").order("created_at", { ascending: false }).limit(8),
      ]);

      // Crescimento nos últimos 6 meses
      const since = startOfMonth(subMonths(new Date(), 5)).toISOString();
      const [profGrowth, cliGrowth] = await Promise.all([
        supabase.from("profiles").select("created_at").gte("created_at", since),
        supabase.from("clients").select("created_at").gte("created_at", since),
      ]);

      const buckets: Record<string, { psicologos: number; clientes: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const key = format(subMonths(new Date(), i), "MMM/yy", { locale: ptBR });
        buckets[key] = { psicologos: 0, clientes: 0 };
      }
      const bucketKey = (iso: string) => format(new Date(iso), "MMM/yy", { locale: ptBR });
      (profGrowth.data ?? []).forEach((r: { created_at: string }) => {
        const k = bucketKey(r.created_at);
        if (buckets[k]) buckets[k].psicologos++;
      });
      (cliGrowth.data ?? []).forEach((r: { created_at: string }) => {
        const k = bucketKey(r.created_at);
        if (buckets[k]) buckets[k].clientes++;
      });
      const growth = Object.entries(buckets).map(([month, v]) => ({ month, ...v }));

      const monthStart = startOfMonth(new Date()).toISOString();
      const newThisMonth = (profilesRes.data ?? []).filter(
        (p: { created_at: string }) => p.created_at >= monthStart,
      ).length;

      return {
        psychologists: psychRes.count ?? 0,
        clients: clientsRes.count ?? 0,
        sessionsDone: sessionsRes.count ?? 0,
        activeUsers: activeRes.count ?? 0,
        newThisMonth,
        growth,
        recentProfiles: profilesRes.data ?? [],
        recentAudit: auditRes.data ?? [],
      };
    },
  });

  const cards = [
    { label: "Psicólogos cadastrados", value: data?.psychologists ?? 0, icon: Stethoscope, tint: "bg-primary/10 text-primary" },
    { label: "Clientes na plataforma", value: data?.clients ?? 0, icon: Users, tint: "bg-blue-500/10 text-blue-600" },
    { label: "Atendimentos realizados", value: data?.sessionsDone ?? 0, icon: CalendarCheck, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Usuários ativos", value: data?.activeUsers ?? 0, icon: UserCheck, tint: "bg-purple-500/10 text-purple-600" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard administrativo</h1>
        <p className="text-muted-foreground mt-1">Visão geral e indicadores da plataforma.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold mt-1">{isLoading ? "…" : c.value}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${c.tint}`}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Novos cadastros no mês */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Crescimento (últimos 6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.growth ?? []} margin={{ left: -20, right: 8 }}>
                  <defs>
                    <linearGradient id="gPsi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCli" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="psicologos" name="Psicólogos" stroke="hsl(var(--primary))" fill="url(#gPsi)" strokeWidth={2} />
                  <Area type="monotone" dataKey="clientes" name="Clientes" stroke="#3b82f6" fill="url(#gCli)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SummaryRow label="Novos cadastros no mês" value={data?.newThisMonth ?? 0} />
            <SummaryRow label="Média de clientes/psicólogo" value={data && data.psychologists > 0 ? (data.clients / data.psychologists).toFixed(1) : "0"} />
            <SummaryRow label="Atendimentos realizados" value={data?.sessionsDone ?? 0} />
          </CardContent>
        </Card>
      </div>

      {/* Últimos cadastros + atividades recentes */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Últimos cadastros</CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {(data?.recentProfiles ?? []).length === 0 && (
              <p className="p-6 text-sm text-muted-foreground">Nenhum cadastro ainda.</p>
            )}
            {(data?.recentProfiles ?? []).map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3">
                <span className="text-sm font-medium truncate">{p.full_name || "Sem nome"}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(p.created_at), "dd/MM/yyyy")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-primary" />
              Atividades recentes
            </CardTitle>
            <Link to="/admin/auditoria" className="text-xs text-primary hover:underline">
              Ver tudo
            </Link>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {(data?.recentAudit ?? []).length === 0 && (
              <p className="p-6 text-sm text-muted-foreground">Sem atividades registradas.</p>
            )}
            {(data?.recentAudit ?? []).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 px-6 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{a.action}</Badge>
                    <span className="text-xs text-muted-foreground truncate">{a.entity ?? "—"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{a.actor_email ?? "sistema"}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(a.created_at), "dd/MM HH:mm")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
