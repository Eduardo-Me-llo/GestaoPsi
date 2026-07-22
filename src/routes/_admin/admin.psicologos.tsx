import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  adminCreatePsychologist,
  adminDeleteUser,
  adminSetPassword,
} from "@/lib/admin-actions";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Ban,
  CheckCircle2,
  Power,
  KeyRound,
  Trash2,
  ShieldPlus,
  ShieldMinus,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_admin/admin/psicologos")({
  component: PsychologistsPage,
});

type Psychologist = {
  id: string;
  full_name: string | null;
  cpf: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  is_blocked: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  client_count: number;
};

function PsychologistsPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "ativos" | "bloqueados">("todos");
  const [createOpen, setCreateOpen] = useState(false);
  const [details, setDetails] = useState<Psychologist | null>(null);
  const [editing, setEditing] = useState<Psychologist | null>(null);
  const [resetting, setResetting] = useState<Psychologist | null>(null);
  const [deleting, setDeleting] = useState<Psychologist | null>(null);
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<Psychologist[]>({
    queryKey: ["admin-psychologists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_psychologists")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Psychologist[];
    },
  });

  const filtered = rows.filter((r) => {
    const matchesQ =
      r.full_name?.toLowerCase().includes(q.toLowerCase()) ||
      r.email?.toLowerCase().includes(q.toLowerCase()) ||
      r.cpf?.includes(q);
    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "ativos" && r.is_active && !r.is_blocked) ||
      (statusFilter === "bloqueados" && r.is_blocked);
    return (q === "" || matchesQ) && matchesStatus;
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-psychologists"] });

  // Toggle bloqueio/ativação via RLS admin em profiles
  const toggleFlag = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: "is_blocked" | "is_active"; value: boolean }) => {
      const { error } = await supabase.from("profiles").update({ [field]: value }).eq("id", id);
      if (error) throw error;
      await logAudit({
        action: field === "is_blocked" ? (value ? "block" : "unblock") : value ? "activate" : "deactivate",
        entity: "profiles",
        entityId: id,
      });
    },
    onSuccess: () => { toast.success("Atualizado."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  // Promover / rebaixar admin via user_roles
  const toggleAdmin = useMutation({
    mutationFn: async ({ id, makeAdmin }: { id: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase.from("user_roles").insert({ user_id: id, role: "admin" });
        if (error && !error.message.includes("duplicate")) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "admin");
        if (error) throw error;
      }
      await logAudit({ action: "role_change", entity: "user_roles", entityId: id, details: { admin: makeAdmin } });
    },
    onSuccess: () => { toast.success("Permissões atualizadas."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      await adminDeleteUser({ data: { userId: id } });
      await logAudit({ action: "delete", entity: "auth.users", entityId: id });
    },
    onSuccess: () => { toast.success("Psicólogo excluído."); setDeleting(null); invalidate(); },
    onError: (e: Error) =>
      toast.error(
        e.message.includes("service_role") || e.message.includes("SERVICE_ROLE")
          ? "Exclusão requer a chave service_role configurada no servidor."
          : e.message,
      ),
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Psicólogos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os profissionais cadastrados na plataforma.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo psicólogo</Button>
          </DialogTrigger>
          <CreateDialog onClose={() => setCreateOpen(false)} onDone={invalidate} />
        </Dialog>
      </div>

      {/* Busca + filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome, e-mail ou CPF" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex rounded-lg border overflow-hidden">
          {(["todos", "ativos", "bloqueados"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Nenhum psicólogo encontrado.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Nome</th>
                  <th className="p-3 font-medium">E-mail</th>
                  <th className="p-3 font-medium text-center">Clientes</th>
                  <th className="p-3 font-medium">Último acesso</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">{r.full_name || "—"}</td>
                    <td className="p-3 text-muted-foreground">{r.email || "—"}</td>
                    <td className="p-3 text-center">{r.client_count}</td>
                    <td className="p-3 text-muted-foreground">
                      {r.last_sign_in_at ? format(new Date(r.last_sign_in_at), "dd/MM/yyyy HH:mm") : "Nunca"}
                    </td>
                    <td className="p-3">
                      {r.is_blocked ? (
                        <Badge variant="destructive">Bloqueado</Badge>
                      ) : r.is_active ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => setDetails(r)}>
                            <Eye className="h-4 w-4 mr-2" />Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditing(r)}>
                            <KeyRound className="h-4 w-4 mr-2" />Editar dados
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {r.is_blocked ? (
                            <DropdownMenuItem onClick={() => toggleFlag.mutate({ id: r.id, field: "is_blocked", value: false })}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />Desbloquear
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => toggleFlag.mutate({ id: r.id, field: "is_blocked", value: true })}>
                              <Ban className="h-4 w-4 mr-2" />Bloquear
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => toggleFlag.mutate({ id: r.id, field: "is_active", value: !r.is_active })}>
                            <Power className="h-4 w-4 mr-2" />{r.is_active ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setResetting(r)}>
                            <KeyRound className="h-4 w-4 mr-2" />Redefinir senha
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleAdmin.mutate({ id: r.id, makeAdmin: true })}>
                            <ShieldPlus className="h-4 w-4 mr-2" />Promover a admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleAdmin.mutate({ id: r.id, makeAdmin: false })}>
                            <ShieldMinus className="h-4 w-4 mr-2" />Remover admin
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-600" onClick={() => setDeleting(r)}>
                            <Trash2 className="h-4 w-4 mr-2" />Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Detalhes */}
      <Dialog open={!!details} onOpenChange={(v) => !v && setDetails(null)}>
        {details && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{details.full_name || "Psicólogo"}</DialogTitle>
              <DialogDescription>Detalhes do profissional</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <DetailRow label="E-mail" value={details.email} />
              <DetailRow label="CPF" value={details.cpf} />
              <DetailRow label="Telefone" value={details.phone} />
              <DetailRow label="Clientes cadastrados" value={String(details.client_count)} />
              <DetailRow label="Cadastrado em" value={format(new Date(details.created_at), "dd/MM/yyyy")} />
              <DetailRow label="Último acesso" value={details.last_sign_in_at ? format(new Date(details.last_sign_in_at), "dd/MM/yyyy HH:mm") : "Nunca"} />
              <DetailRow label="Situação" value={details.is_blocked ? "Bloqueado" : details.is_active ? "Ativo" : "Inativo"} />
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Editar */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        {editing && <EditDialog row={editing} onClose={() => setEditing(null)} onDone={invalidate} />}
      </Dialog>

      {/* Redefinir senha */}
      <Dialog open={!!resetting} onOpenChange={(v) => !v && setResetting(null)}>
        {resetting && <ResetPasswordDialog row={resetting} onClose={() => setResetting(null)} />}
      </Dialog>

      {/* Excluir */}
      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir psicólogo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove permanentemente <strong>{deleting?.full_name || deleting?.email}</strong> e todos os
              dados associados (clientes, sessões, financeiro). Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => deleting && del.mutate(deleting.id)}
              disabled={del.isPending}
            >
              Excluir definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value || "—"}</span>
    </div>
  );
}

function CreateDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const mut = useMutation({
    mutationFn: async () => {
      await adminCreatePsychologist({ data: form });
      await logAudit({ action: "insert", entity: "auth.users", details: { email: form.email } });
    },
    onSuccess: () => { toast.success("Psicólogo criado!"); onDone(); onClose(); },
    onError: (e: Error) =>
      toast.error(
        e.message.includes("service_role") || e.message.includes("SERVICE_ROLE")
          ? "Criação requer a chave service_role configurada no servidor."
          : e.message,
      ),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display">Novo psicólogo</DialogTitle>
        <DialogDescription>A conta é criada já confirmada e pronta para uso.</DialogDescription>
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

function EditDialog({ row, onClose, onDone }: { row: Psychologist; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ full_name: row.full_name ?? "", cpf: row.cpf ?? "", phone: row.phone ?? "" });
  const mut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: form.full_name || null, cpf: form.cpf || null, phone: form.phone || null })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Dados atualizados."); onDone(); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display">Editar psicólogo</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
        <div className="space-y-2">
          <Label>Nome completo</Label>
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mut.isPending}>Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function ResetPasswordDialog({ row, onClose }: { row: Psychologist; onClose: () => void }) {
  const [password, setPassword] = useState("");

  // Opção 1: definir senha diretamente (server fn, exige service_role)
  const setDirect = useMutation({
    mutationFn: async () => {
      await adminSetPassword({ data: { userId: row.id, password } });
      await logAudit({ action: "password_reset", entity: "auth.users", entityId: row.id });
    },
    onSuccess: () => { toast.success("Senha redefinida."); onClose(); },
    onError: (e: Error) =>
      toast.error(
        e.message.includes("service_role") || e.message.includes("SERVICE_ROLE")
          ? "Definir senha direto requer service_role. Use o envio por e-mail."
          : e.message,
      ),
  });

  // Opção 2: enviar e-mail de redefinição (funciona sem service_role)
  const sendEmail = useMutation({
    mutationFn: async () => {
      if (!row.email) throw new Error("Psicólogo sem e-mail cadastrado.");
      const { error } = await supabase.auth.resetPasswordForEmail(row.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      await logAudit({ action: "password_reset", entity: "auth.users", entityId: row.id, details: { via: "email" } });
    },
    onSuccess: () => { toast.success("E-mail de redefinição enviado."); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display">Redefinir senha</DialogTitle>
        <DialogDescription>{row.full_name || row.email}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nova senha (definir diretamente)</Label>
          <div className="flex gap-2">
            <Input type="text" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            <Button onClick={() => setDirect.mutate()} disabled={password.length < 6 || setDirect.isPending}>Definir</Button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />ou<div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={() => sendEmail.mutate()} disabled={sendEmail.isPending}>
          Enviar e-mail de redefinição
        </Button>
      </div>
    </DialogContent>
  );
}
