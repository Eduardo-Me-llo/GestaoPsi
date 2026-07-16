import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { differenceInYears } from "date-fns";
import { Users, Calendar, DollarSign, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/relatorios")({
  component: ReportsPage,
});

const COLORS = ["oklch(0.55 0.2 275)", "oklch(0.7 0.18 340)", "oklch(0.7 0.16 200)", "oklch(0.75 0.16 90)"];
const currency = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ReportsPage() {
  const { data: clients = [] } = useQuery({
    queryKey: ["report-clients"],
    queryFn: async () => (await supabase.from("clients").select("*")).data ?? [],
  });
  const { data: sessions = [] } = useQuery({
    queryKey: ["report-sessions"],
    queryFn: async () => (await supabase.from("sessions").select("*")).data ?? [],
  });
  const { data: txs = [] } = useQuery({
    queryKey: ["report-txs"],
    queryFn: async () => (await supabase.from("transactions").select("*")).data ?? [],
  });

  const gender = groupBy(clients, (c: any) => c.gender || "Não informado");
  const genderData = Object.entries(gender).map(([name, v]) => ({ name, value: (v as any[]).length }));

  const buckets = { "0-12": 0, "13-17": 0, "18-29": 0, "30-49": 0, "50+": 0 } as Record<string, number>;
  clients.forEach((c: any) => {
    if (!c.birth_date) return;
    const a = differenceInYears(new Date(), new Date(c.birth_date));
    if (a <= 12) buckets["0-12"]++;
    else if (a <= 17) buckets["13-17"]++;
    else if (a <= 29) buckets["18-29"]++;
    else if (a <= 49) buckets["30-49"]++;
    else buckets["50+"]++;
  });
  const ageData = Object.entries(buckets).map(([name, value]) => ({ name, value }));

  const status = groupBy(clients, (c: any) => c.status || "ativo");
  const statusData = Object.entries(status).map(([name, v]) => ({ name, value: (v as any[]).length }));

  const sessionsRealized = sessions.filter((s: any) => s.status === "presente").length;
  const receitaPaga = txs.filter((t: any) => t.kind === "receita" && t.paid_at).reduce((s: number, t: any) => s + Number(t.amount), 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground mt-1">Visão geral da sua prática.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Kpi icon={Users} label="Clientes ativos" value={String(clients.filter((c: any) => c.status === "ativo").length)} />
        <Kpi icon={Calendar} label="Sessões agendadas" value={String(sessions.length)} />
        <Kpi icon={CheckCircle2} label="Sessões realizadas" value={String(sessionsRealized)} />
        <Kpi icon={DollarSign} label="Receita recebida" value={currency(receitaPaga)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-display">Clientes por gênero</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">Clientes por faixa etária</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="font-display">Distribuição por status</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" allowDecimals={false} />
                <YAxis type="category" dataKey="name" className="text-xs capitalize" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.7 0.18 340)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold font-display">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
