import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/clientes/")({
  component: ClientsPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Nome obrigatório").max(120),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  session_value: z.string().optional().or(z.literal("")),
});

function ClientsPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = clients.filter((c: any) =>
    c.full_name.toLowerCase().includes(q.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus pacientes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo cliente</Button>
          </DialogTrigger>
          <NewClientDialog onClose={() => setOpen(false)} />
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou e-mail" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          {isLoading && <div className="p-6 text-sm text-muted-foreground">Carregando...</div>}
          {!isLoading && filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">Nenhum cliente cadastrado.</div>
          )}
          {filtered.map((c: any) => (
            <Link
              key={c.id}
              to="/clientes/$id"
              params={{ id: c.id }}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.full_name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.email || c.phone || "—"}</div>
              </div>
              <Badge variant={c.status === "active" ? "default" : "secondary"}>
                {c.status === "active" ? "Ativo" : c.status ?? "—"}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function NewClientDialog({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", birth_date: "", session_value: "" });

  const mut = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse(form);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão expirada");
      const { error } = await supabase.from("clients").insert({
        user_id: userData.user.id,
        full_name: parsed.full_name,
        email: parsed.email || null,
        phone: parsed.phone || null,
        birth_date: parsed.birth_date || null,
        session_value: parsed.session_value ? Number(parsed.session_value) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente cadastrado!");
      qc.invalidateQueries({ queryKey: ["clients"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao salvar"),
  });

  return (
    <DialogContent>
      <DialogHeader><DialogTitle className="font-display">Novo cliente</DialogTitle></DialogHeader>
      <form
        className="space-y-4"
        onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}
      >
        <div className="space-y-2">
          <Label>Nome completo *</Label>
          <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
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
            <Label>Valor da sessão (R$)</Label>
            <Input type="number" step="0.01" value={form.session_value} onChange={(e) => setForm({ ...form, session_value: e.target.value })} />
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
