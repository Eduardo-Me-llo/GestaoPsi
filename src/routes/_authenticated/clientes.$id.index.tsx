import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clientes/$id/")({
  component: ClientOverview,
});

type ClientForm = {
  full_name: string;
  social_name: string;
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  gender: string;
  birth_date: string;
  session_value: string;
  plan_type: "sessao" | "mensalidade";
  status: "ativo" | "inativo" | "desistente" | "alta" | "espera";
  group_tag: string;
  notes: string;
};

const EMPTY: ClientForm = {
  full_name: "", social_name: "", cpf: "", rg: "", email: "", phone: "",
  gender: "", birth_date: "", session_value: "", plan_type: "sessao",
  status: "ativo", group_tag: "", notes: "",
};

function ClientOverview() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const { data: client } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
      return data;
    },
  });

  const rows: Array<[string, string | null | undefined]> = [
    ["Nome", client?.full_name],
    ["Nome social", client?.social_name],
    ["CPF", client?.cpf],
    ["RG", client?.rg],
    ["E-mail", client?.email],
    ["Telefone", client?.phone],
    ["Gênero", client?.gender],
    ["Nascimento", client?.birth_date],
    ["Status", client?.status],
    ["Plano", client?.plan_type],
    ["Grupo/Tag", client?.group_tag],
    ["Valor da sessão", client?.session_value ? `R$ ${Number(client.session_value).toFixed(2)}` : null],
  ];

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente excluído");
      qc.invalidateQueries({ queryKey: ["clients"] });
      navigate({ to: "/clientes" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Pencil className="h-4 w-4 mr-1" /> Editar cliente</Button>
          </DialogTrigger>
          <EditClientDialog id={id} client={client} onDone={() => setEditOpen(false)} />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4 mr-1" /> Excluir</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação removerá o cliente e todos os registros vinculados (sessões, anamnese, rodas). Não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => del.mutate()}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Dados pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-1 border-b last:border-0 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-right">{v || "—"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Observações</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client?.notes || "Nenhuma observação."}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EditClientDialog({ id, client, onDone }: { id: string; client: any; onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<ClientForm>(EMPTY);

  useEffect(() => {
    if (client) {
      setForm({
        full_name: client.full_name ?? "",
        social_name: client.social_name ?? "",
        cpf: client.cpf ?? "",
        rg: client.rg ?? "",
        email: client.email ?? "",
        phone: client.phone ?? "",
        gender: client.gender ?? "",
        birth_date: client.birth_date ?? "",
        session_value: client.session_value?.toString() ?? "",
        plan_type: client.plan_type ?? "sessao",
        status: client.status ?? "ativo",
        group_tag: client.group_tag ?? "",
        notes: client.notes ?? "",
      });
    }
  }, [client]);

  const mut = useMutation({
    mutationFn: async () => {
      if (!form.full_name.trim()) throw new Error("Nome é obrigatório");
      const { error } = await supabase.from("clients").update({
        full_name: form.full_name.trim(),
        social_name: form.social_name || null,
        cpf: form.cpf || null,
        rg: form.rg || null,
        email: form.email || null,
        phone: form.phone || null,
        gender: form.gender || null,
        birth_date: form.birth_date || null,
        session_value: form.session_value ? Number(form.session_value) : null,
        plan_type: form.plan_type,
        status: form.status,
        group_tag: form.group_tag || null,
        notes: form.notes || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente atualizado");
      qc.invalidateQueries({ queryKey: ["client", id] });
      qc.invalidateQueries({ queryKey: ["clients"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-display">Editar cliente</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2 sm:col-span-2">
            <Label>Nome completo *</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Nome social</Label>
            <Input value={form.social_name} onChange={(e) => setForm({ ...form, social_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Gênero</Label>
            <Select value={form.gender || "none"} onValueChange={(v) => setForm({ ...form, gender: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não informado</SelectItem>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>RG</Label>
            <Input value={form.rg} onChange={(e) => setForm({ ...form, rg: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Nascimento</Label>
            <Input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Grupo / tag</Label>
            <Input value={form.group_tag} onChange={(e) => setForm({ ...form, group_tag: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="espera">Em espera</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="desistente">Desistente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Plano</Label>
            <Select value={form.plan_type} onValueChange={(v: any) => setForm({ ...form, plan_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sessao">Por sessão</SelectItem>
                <SelectItem value="mensalidade">Mensalidade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valor da sessão (R$)</Label>
            <Input type="number" step="0.01" value={form.session_value} onChange={(e) => setForm({ ...form, session_value: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Observações</Label>
          <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onDone}>Cancelar</Button>
          <Button type="submit" disabled={mut.isPending}>Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
