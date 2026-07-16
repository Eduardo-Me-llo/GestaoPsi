import { createFileRoute } from "@tanstack/react-router";
import { TransactionsPage } from "@/components/finance/TransactionsPage";

export const Route = createFileRoute("/_authenticated/financeiro/receitas")({
  component: () => <TransactionsPage kind="receita" title="Receitas" />,
});
