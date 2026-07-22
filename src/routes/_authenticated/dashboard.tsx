import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign, Activity, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { count: clientCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });
      return { clientCount: clientCount ?? 0 };
    },
  });

  const cards = [
    { label: "Clientes ativos", value: stats?.clientCount ?? 0, icon: Users, tint: "bg-primary/10 text-primary" },
    { label: "Sessões esta semana", value: 0, icon: Calendar, tint: "bg-blue-500/10 text-blue-600" },
    { label: "Receita mensal", value: "R$ 0,00", icon: DollarSign, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Rodas realizadas", value: 0, icon: Activity, tint: "bg-purple-500/10 text-purple-600" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu consultório.</p>
        </div>
        <Button asChild>
          <Link to="/clientes"><Plus className="h-4 w-4 mr-2" />Novo cliente</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold mt-1">{c.value}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${c.tint}`}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Próximas sessões</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhuma sessão agendada.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Tarefas</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sem tarefas pendentes.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
