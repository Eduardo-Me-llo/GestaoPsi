import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Activity, FileText, User, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/clientes/$id")({
  component: ClientLayout,
});

function ClientLayout() {
  const { id } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: client } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const tabs = [
    { to: `/clientes/${id}`, label: "Visão geral", icon: User, exact: true },
    { to: `/clientes/${id}/prontuario`, label: "Prontuário", icon: ClipboardList },
    { to: `/clientes/${id}/roda-adulto`, label: "Roda (Adulto)", icon: Activity },
    { to: `/clientes/${id}/roda-adolescente`, label: "Roda (Adolescente)", icon: Activity },
    { to: `/clientes/${id}/roda-via`, label: "Roda VIA ME", icon: Activity },
    { to: `/clientes/${id}/anamnese`, label: "Anamnese", icon: FileText },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/clientes"><ArrowLeft className="h-4 w-4 mr-1" />Clientes</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{client?.full_name ?? "Carregando..."}</h1>
            <p className="text-sm text-muted-foreground">{client?.email ?? client?.phone ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 border-b">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          return (
            <a
              key={t.to}
              href={t.to}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </a>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
