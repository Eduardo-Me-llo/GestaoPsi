import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ScrollText } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_admin/admin/auditoria")({
  component: AuditPage,
});

type AuditLog = {
  id: string;
  user_id: string | null;
  actor_email: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  ip_address: string | null;
  created_at: string;
};

const ACTION_LABELS: Record<string, string> = {
  login: "Login",
  logout: "Logout",
  insert: "Inclusão",
  update: "Atualização",
  delete: "Exclusão",
  block: "Bloqueio",
  unblock: "Desbloqueio",
  activate: "Ativação",
  deactivate: "Desativação",
  role_change: "Mudança de papel",
  password_reset: "Redefinição de senha",
  settings_update: "Config. do sistema",
};

const actionVariant = (a: string): "default" | "secondary" | "destructive" | "outline" => {
  if (a === "delete") return "destructive";
  if (a === "insert" || a === "login") return "default";
  if (a === "block" || a === "deactivate") return "outline";
  return "secondary";
};

function AuditPage() {
  const [q, setQ] = useState("");
  const [action, setAction] = useState<string>("todas");

  const { data: rows = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const filtered = rows.filter((r) => {
    const t = q.toLowerCase();
    const matchesQ =
      q === "" ||
      (r.actor_email ?? "").toLowerCase().includes(t) ||
      (r.entity ?? "").toLowerCase().includes(t) ||
      (r.ip_address ?? "").includes(q);
    const matchesAction = action === "todas" || r.action === action;
    return matchesQ && matchesAction;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          Auditoria
        </h1>
        <p className="text-muted-foreground mt-1">
          Registro de logins, alterações, inclusões e exclusões na plataforma.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por usuário, entidade ou IP" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as ações</SelectItem>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Nenhum registro de auditoria.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Data/hora</th>
                  <th className="p-3 font-medium">Ação</th>
                  <th className="p-3 font-medium">Entidade</th>
                  <th className="p-3 font-medium">Usuário</th>
                  <th className="p-3 font-medium">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {format(new Date(r.created_at), "dd/MM/yyyy HH:mm:ss")}
                    </td>
                    <td className="p-3">
                      <Badge variant={actionVariant(r.action)}>{ACTION_LABELS[r.action] ?? r.action}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {r.entity ?? "—"}{r.entity_id ? <span className="text-xs opacity-60"> #{r.entity_id.slice(0, 8)}</span> : null}
                    </td>
                    <td className="p-3 text-muted-foreground">{r.actor_email ?? "sistema"}</td>
                    <td className="p-3 text-muted-foreground font-mono text-xs">{r.ip_address ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {filtered.length >= 500 && (
        <p className="text-xs text-muted-foreground text-center">Exibindo os 500 registros mais recentes.</p>
      )}
    </div>
  );
}
