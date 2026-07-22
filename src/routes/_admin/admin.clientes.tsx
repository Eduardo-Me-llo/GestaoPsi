import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logAudit } from "@/lib/audit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Search, Pencil, Trash2, Ban } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_admin/admin/clientes")({
  component: AdminClientsPage,
});

type AdminClient = {
  id: string;
  full_name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  psychologist_id: string;
  psychologist_name: string | null;
};

function AdminClientsPage() {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminClient | null>(null);
  const [deleting, setDeleting] = useState<AdminClient | null>(null);
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<AdminClient[]>({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdminClient[];
    },
  });

  const filtered = rows.filter((r) => {
    const t = q.toLowerCase();
    return (
      q === "" ||
      r.full_name.toLowerCase().includes(t) ||
      (r.cpf ?? "").includes(q) ||
      (r.psychologist_name ?? "").toLowerCase().includes(t)
    );
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-clients"] });

  const block = useMutation({
    mutationFn: async (c: AdminClient) => {
      const { error } = await supabase.from("clients").update({ status: "inativo" }).eq("id", c.id);
      if (error) throw error;
      await logAudit({ action: "block", entity: "clients", entityId: c.id });
    },
    onSuccess: () => { toast.success("Cliente inativado."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Cliente excluído."); setDeleting(null); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground mt-1">
          Todos os clientes da plataforma, com o psicólogo responsável.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome, CPF ou psicólogo" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Cliente</th>
                  <th className="p-3 font-medium">CPF</th>
                  <th className="p-3 font-medium">Psicólogo responsável</th>
                  <th className="p-3 font-medium">Cadastro</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">{c.full_name}</td>
                    <td className="p-3 text-muted-foreground">{c.cpf || "—"}</td>
                    <td className="p-3 text-muted-foreground">{c.psychologist_name || "—"}</td>
                    <td className="p-3 text-muted-foreground">{format(new Date(c.created_at), "dd/MM/yyyy")}</td>
                    <td className="p-3">
                      <Badge variant={c.status === "ativo" ? "default" : "secondary"} className="capitalize">{c.status}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" title="Editar" onClick={() => setEditing(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Inativar" onClick={() => block.mutate(c)}>
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Excluir" onClick={() => setDeleting(c)}>
                          <Trash2 className="h-4 w-4 text-rose-600" />
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

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        {editing && <EditClientDialog row={editing} onClose={() => setEditing(null)} onDone={invalidate} />}
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove permanentemente <strong>{deleting?.full_name}</strong> e seus dados (sessões, anamneses, rodas).
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => deleting && del.mutate(deleting.id)} disabled={del.isPending}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EditClientDialog({ row, onClose, onDone }: { row: AdminClient; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({
    full_name: row.full_name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    cpf: row.cpf ?? "",
  });
  const mut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("clients")
        .update({
          full_name: form.full_name,
          email: form.email || null,
          phone: form.phone || null,
          cpf: form.cpf || null,
        })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Cliente atualizado."); onDone(); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display">Editar cliente</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
        <div className="space-y-2">
          <Label>Nome completo *</Label>
          <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
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
          <div className="space-y-2 col-span-2">
            <Label>E-mail</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
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
