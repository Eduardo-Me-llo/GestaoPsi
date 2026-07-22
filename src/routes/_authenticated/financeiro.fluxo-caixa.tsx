import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { format, startOfYear, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/financeiro/fluxo-caixa")({
  component: CashFlowPage,
});

const currency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function CashFlowPage() {
  const year = new Date().getFullYear();
  const { data = [], isLoading } = useQuery({
    queryKey: ["transactions", "cashflow", year],
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

  const months = Array.from({ length: 12 }, (_, i) => ({
    idx: i,
    label: format(new Date(year, i, 1), "MMMM", { locale: ptBR }),
    receita: 0,
    despesa: 0,
  }));
  data.forEach((t: any) => {
    const m = new Date(t.due_date + "T12:00:00").getMonth();
    if (t.kind === "receita") months[m].receita += Number(t.amount);
    else months[m].despesa += Number(t.amount);
  });

  let acumulado = 0;
  const rows = months.map((m) => {
    const saldo = m.receita - m.despesa;
    acumulado += saldo;
    return { ...m, saldo, acumulado };
  });

  const total = rows.reduce(
    (acc, r) => ({ receita: acc.receita + r.receita, despesa: acc.despesa + r.despesa }),
    { receita: 0, despesa: 0 }
  );

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3 font-medium">Mês</th>
                <th className="p-3 font-medium text-right">Receitas</th>
                <th className="p-3 font-medium text-right">Despesas</th>
                <th className="p-3 font-medium text-right">Saldo</th>
                <th className="p-3 font-medium text-right">Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r) => (
                <tr key={r.idx}>
                  <td className="p-3 capitalize">{r.label}</td>
                  <td className="p-3 text-right text-emerald-600">{currency(r.receita)}</td>
                  <td className="p-3 text-right text-rose-600">{currency(r.despesa)}</td>
                  <td className={"p-3 text-right font-medium " + (r.saldo >= 0 ? "text-emerald-700" : "text-rose-700")}>
                    {currency(r.saldo)}
                  </td>
                  <td className={"p-3 text-right font-semibold " + (r.acumulado >= 0 ? "text-primary" : "text-rose-700")}>
                    {currency(r.acumulado)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30 font-semibold">
              <tr>
                <td className="p-3">Total</td>
                <td className="p-3 text-right text-emerald-700">{currency(total.receita)}</td>
                <td className="p-3 text-right text-rose-700">{currency(total.despesa)}</td>
                <td className="p-3 text-right" colSpan={2}>
                  {currency(total.receita - total.despesa)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
