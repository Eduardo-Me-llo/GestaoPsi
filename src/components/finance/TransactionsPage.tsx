import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Check, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const currency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function TransactionsPage({ kind, title }: { kind: "receita" | "despesa"; title: string }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["transactions", kind],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, clients(full_name)")
        .eq("kind", kind)
        .order("due_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const togglePaid = useMutation({
    mutationFn: async (t: any) => {
      const { error } = await supabase
        .from("transactions")
        .update({ paid_at: t.paid_at ? null : new Date().toISOString().slice(0, 10) })
        .eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removido");
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nova {kind === "receita" ? "receita" : "despesa"}</Button>
          </DialogTrigger>
          <TransactionDialog kind={kind} editing={editing} onClose={() => { setOpen(false); setEditing(null); }} />
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
          ) : data.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Nenhum lançamento.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Descrição</th>
                  <th className="p-3 font-medium">Categoria</th>
                  {kind === "receita" && <th className="p-3 font-medium">Cliente</th>}
                  <th className="p-3 font-medium">Vencimento</th>
                  <th className="p-3 font-medium text-right">Valor</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((t: any) => (
                  <tr key={t.id}>
                    <td className="p-3">{t.description}</td>
                    <td className="p-3 text-muted-foreground">{t.category ?? "—"}</td>
                    {kind === "receita" && (
                      <td className="p-3 text-muted-foreground">{t.clients?.full_name ?? "—"}</td>
                    )}
                    <td className="p-3">{format(new Date(t.due_date + "T12:00:00"), "dd/MM/yyyy")}</td>
                    <td className={"p-3 text-right font-medium " + (kind === "receita" ? "text-emerald-700" : "text-rose-700")}>
                      {currency(Number(t.amount))}
                    </td>
                    <td className="p-3">
                      <Badge variant={t.paid_at ? "default" : "secondary"}>
                        {t.paid_at ? "Pago" : "Em aberto"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => togglePaid.mutate(t)} title={t.paid_at ? "Marcar como aberto" : "Marcar como pago"}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => { if (confirm("Excluir?")) del.mutate(t.id); }}>
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
    </div>
  );
}

function TransactionDialog({
  kind,
  editing,
  onClose,
}: {
  kind: "receita" | "despesa";
  editing: any;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    description: editing?.description ?? "",
    category: editing?.category ?? "",
    amount: editing?.amount?.toString() ?? "",
    due_date: editing?.due_date ?? today,
    paid: !!editing?.paid_at,
    client_id: editing?.client_id ?? "",
    notes: editing?.notes ?? "",
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients", "select"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, full_name").order("full_name");
      return data ?? [];
    },
    enabled: kind === "receita",
  });

  const mut = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão expirada");
      const payload = {
        user_id: userData.user.id,
        kind,
        description: form.description,
        category: form.category || null,
        amount: Number(form.amount),
        due_date: form.due_date,
        paid_at: form.paid ? (editing?.paid_at ?? today) : null,
        client_id: form.client_id || null,
        notes: form.notes || null,
      };
      if (editing) {
        const { error } = await supabase.from("transactions").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("transactions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvo!");
      qc.invalidateQueries({ queryKey: ["transactions"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-display">
          {editing ? "Editar" : "Nova"} {kind === "receita" ? "receita" : "despesa"}
        </DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
        <div className="space-y-2">
          <Label>Descrição *</Label>
          <Input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Sessão, Aluguel" />
          </div>
          <div className="space-y-2">
            <Label>Valor (R$) *</Label>
            <Input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Vencimento *</Label>
            <Input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.paid ? "pago" : "aberto"} onValueChange={(v) => setForm({ ...form, paid: v === "pago" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aberto">Em aberto</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {kind === "receita" && (
            <div className="space-y-2 col-span-2">
              <Label>Cliente</Label>
              <Select value={form.client_id || "none"} onValueChange={(v) => setForm({ ...form, client_id: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Nenhum —</SelectItem>
                  {clients.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Observações</Label>
          <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mut.isPending}>Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
