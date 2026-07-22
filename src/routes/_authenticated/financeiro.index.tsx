import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { format, startOfYear, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/financeiro/")({
  component: FinancePanel,
});

const currency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function FinancePanel() {
  const year = new Date().getFullYear();
  const { data = [] } = useQuery({
    queryKey: ["transactions", "year", year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("due_date", startOfYear(new Date()).toISOString().slice(0, 10))
        .lte("due_date", endOfYear(new Date()).toISOString().slice(0, 10));
      if (error) throw error;
      return data;
    },
  });

  const totals = data.reduce(
    (acc: any, t: any) => {
      const amt = Number(t.amount);
      if (t.kind === "receita") {
        acc.receitaTotal += amt;
        if (t.paid_at) acc.receitaPaga += amt;
        else acc.receitaAberta += amt;
      } else {
        acc.despesaTotal += amt;
      }
      return acc;
    },
    { receitaTotal: 0, receitaPaga: 0, receitaAberta: 0, despesaTotal: 0 }
  );

  const monthly = Array.from({ length: 12 }, (_, i) => ({
    mes: format(new Date(year, i, 1), "MMM", { locale: ptBR }),
    receita: 0,
    despesa: 0,
  }));
  data.forEach((t: any) => {
    const d = new Date(t.due_date + "T12:00:00");
    const m = d.getMonth();
    if (t.kind === "receita") monthly[m].receita += Number(t.amount);
    else monthly[m].despesa += Number(t.amount);
  });

  const saldo = totals.receitaPaga - totals.despesaTotal;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={ArrowUpCircle} label="Receitas recebidas" value={currency(totals.receitaPaga)} tint="text-emerald-600" />
        <StatCard icon={TrendingUp} label="A receber" value={currency(totals.receitaAberta)} tint="text-amber-600" />
        <StatCard icon={ArrowDownCircle} label="Despesas" value={currency(totals.despesaTotal)} tint="text-rose-600" />
        <StatCard icon={Wallet} label="Saldo" value={currency(saldo)} tint={saldo >= 0 ? "text-primary" : "text-rose-600"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Desempenho anual — {year}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="mes" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `R$${v}`} />
              <Tooltip formatter={(v: any) => currency(Number(v))} />
              <Legend />
              <Bar dataKey="receita" name="Receita" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="despesa" name="Despesa" fill="oklch(0.65 0.2 20)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <Icon className={`h-8 w-8 ${tint}`} />
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold font-display">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
