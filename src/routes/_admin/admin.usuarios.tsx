import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminCreatePsychologist } from "@/lib/admin-actions";
import { logAudit } from "@/lib/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Power, ShieldMinus, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_admin/admin/usuarios")({
  component: AdminUsersPage,
});

type AdminUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  is_active: boolean;
  is_blocked: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

function AdminUsersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [revoking, setRevoking] = useState<AdminUser | null>(null);
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdminUser[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-users"] });
    qc.invalidateQueries({ queryKey: ["admin-psychologists"] });
  };

  const toggleActive = useMutation({
    mutationFn: async (u: AdminUser) => {
      const { error } = await supabase.from("profiles").update({ is_active: !u.is_active }).eq("id", u.id);
      if (error) throw error;
      await logAudit({ action: u.is_active ? "deactivate" : "activate", entity: "profiles", entityId: u.id });
    },
    onSuccess: () => { toast.success("Atualizado."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const revokeAdmin = useMutation({
    mutationFn: async (u: AdminUser) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", u.id).eq("role", "admin");
      if (error) throw error;
      await logAudit({ action: "role_change", entity: "user_roles", entityId: u.id, details: { admin: false } });
    },
    onSuccess: () => { toast.success("Acesso de administrador removido."); setRevoking(null); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Usuários & Permissões</h1>
          <p className="text-muted-foreground mt-1">Administradores da plataforma e níveis de acesso.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="h-4 w-4 mr-2" />Novo administrador</Button>
          </DialogTrigger>
          <CreateAdminDialog onClose={() => setCreateOpen(false)} onDone={invalidate} />
        </Dialog>
      </div>

      {/* Promover usuário existente por e-mail */}
      <PromoteByEmail onDone={invalidate} />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Nenhum administrador cadastrado.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Nome</th>
                  <th className="p-3 font-medium">E-mail</th>
                  <th className="p-3 font-medium">Papéis</th>
                  <th className="p-3 font-medium">Último acesso</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">{u.full_name || "—"}</td>
                    <td className="p-3 text-muted-foreground">{u.email || "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {u.roles.map((r) => (
                          <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="capitalize">
                            {r === "admin" && <ShieldCheck className="h-3 w-3 mr-1" />}{r}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {u.last_sign_in_at ? format(new Date(u.last_sign_in_at), "dd/MM/yyyy HH:mm") : "Nunca"}
                    </td>
                    <td className="p-3">
                      {u.is_blocked ? (
                        <Badge variant="destructive">Bloqueado</Badge>
                      ) : u.is_active ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" title={u.is_active ? "Desativar" : "Ativar"} onClick={() => toggleActive.mutate(u)}>
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Remover admin" onClick={() => setRevoking(u)}>
                          <ShieldMinus className="h-4 w-4 text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!revoking} onOpenChange={(v) => !v && setRevoking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover acesso de administrador?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{revoking?.full_name || revoking?.email}</strong> deixará de ter acesso ao painel administrativo.
              A conta continua existindo como psicólogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => revoking && revokeAdmin.mutate(revoking)} disabled={revokeAdmin.isPending}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PromoteByEmail({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const mut = useMutation({
    mutationFn: async () => {
      // Localiza o perfil pelo e-mail através da view de psicólogos (admin-only)
      const { data, error } = await supabase
        .from("admin_psychologists")
        .select("id, email")
        .eq("email", email.trim())
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Nenhum usuário encontrado com este e-mail.");
      const { error: insErr } = await supabase.from("user_roles").insert({ user_id: data.id, role: "admin" });
      if (insErr && !insErr.message.includes("duplicate")) throw insErr;
      await logAudit({ action: "role_change", entity: "user_roles", entityId: data.id, details: { admin: true } });
    },
    onSuccess: () => { toast.success("Usuário promovido a administrador."); setEmail(""); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <Label className="text-sm">Promover usuário existente a administrador</Label>
        <div className="flex gap-2 mt-2 max-w-md">
          <Input type="email" placeholder="e-mail do psicólogo" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={() => mut.mutate()} disabled={!email || mut.isPending}>Promover</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          O usuário precisa já ter uma conta. Ele passa a acessar o painel administrativo mantendo o perfil de psicólogo.
        </p>
      </CardContent>
    </Card>
  );
}

function CreateAdminDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const mut = useMutation({
    mutationFn: async () => {
      const res = await adminCreatePsychologist({ data: form });
      const newId = (res as { id?: string })?.id;
      if (newId) {
        const { error } = await supabase.from("user_roles").insert({ user_id: newId, role: "admin" });
        if (error && !error.message.includes("duplicate")) throw error;
      }
      await logAudit({ action: "insert", entity: "auth.users", details: { email: form.email, admin: true } });
    },
    onSuccess: () => { toast.success("Administrador criado!"); onDone(); onClose(); },
    onError: (e: Error) =>
      toast.error(
        e.message.includes("service_role") || e.message.includes("SERVICE_ROLE")
          ? "Criação requer a chave service_role no servidor. Use 'Promover por e-mail'."
          : e.message,
      ),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display">Novo administrador</DialogTitle>
        <DialogDescription>Cria uma conta nova já com acesso administrativo.</DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
        <div className="space-y-2">
          <Label>Nome completo *</Label>
          <Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>E-mail *</Label>
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Senha provisória *</Label>
          <Input type="text" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mut.isPending}>Criar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
