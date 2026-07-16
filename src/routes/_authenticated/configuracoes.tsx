import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_AGENDA,
  DEFAULT_NOTIFICATIONS,
  getAvatarPath,
  getSignedAvatarUrl,
  type AgendaSettings,
  type NotificationSettings,
} from "@/lib/user-settings";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">Perfil, agenda, notificações e segurança.</p>
      </div>
      <ProfileSection />
      <AgendaSection />
      <NotificationsSection />
      <PasswordSection />
      <AccountSection />
    </div>
  );
}

/* --------------------------- PROFILE + AVATAR --------------------------- */

function ProfileSection() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return { ...(data ?? {}), email: u.user.email, userId: u.user.id };
    },
  });

  const [form, setForm] = useState({ full_name: "", cpf: "", phone: "", birth_date: "", bio: "" });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      const address: any = profile.address ?? {};
      setForm({
        full_name: profile.full_name ?? "",
        cpf: profile.cpf ?? "",
        phone: profile.phone ?? "",
        birth_date: profile.birth_date ?? "",
        bio: address.bio ?? "",
      });
      const path = getAvatarPath(address);
      if (path) getSignedAvatarUrl(path).then(setAvatarUrl);
      else setAvatarUrl(null);
    }
  }, [profile]);

  const mut = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const currentAddress: any = profile?.address ?? {};
      const { error } = await supabase.from("profiles").upsert({
        id: u.user.id,
        full_name: form.full_name || null,
        cpf: form.cpf || null,
        phone: form.phone || null,
        birth_date: form.birth_date || null,
        address: { ...currentAddress, bio: form.bio || undefined },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Perfil atualizado");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["profile", "header"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!profile?.userId) throw new Error("Sessão expirada");
      if (file.size > 3 * 1024 * 1024) throw new Error("Imagem muito grande (máx 3MB)");
      if (!file.type.startsWith("image/")) throw new Error("Envie uma imagem válida");
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${profile.userId}/avatar-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      // remove old avatar if any
      const oldPath = getAvatarPath(profile.address);
      if (oldPath && oldPath !== path) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }

      const currentAddress: any = profile.address ?? {};
      const { error: upsertErr } = await supabase.from("profiles").upsert({
        id: profile.userId,
        address: { ...currentAddress, avatar_path: path },
      });
      if (upsertErr) throw upsertErr;
    },
    onSuccess: () => {
      toast.success("Foto atualizada");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["profile", "header"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeAvatar = useMutation({
    mutationFn: async () => {
      if (!profile?.userId) return;
      const path = getAvatarPath(profile.address);
      if (path) await supabase.storage.from("avatars").remove([path]);
      const currentAddress: any = profile.address ?? {};
      const { avatar_path: _drop, ...rest } = currentAddress;
      const { error } = await supabase.from("profiles").upsert({ id: profile.userId, address: rest });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Foto removida");
      setAvatarUrl(null);
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["profile", "header"] });
    },
  });

  const initials = (form.full_name || profile?.email || "?")
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Perfil profissional</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            {avatarUrl && <AvatarImage src={avatarUrl} alt="Foto de perfil" />}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAvatar.mutate(f);
                e.target.value = "";
              }}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploadAvatar.isPending}>
                <Camera className="h-4 w-4 mr-1" /> {uploadAvatar.isPending ? "Enviando..." : "Alterar foto"}
              </Button>
              {avatarUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAvatar.mutate()}>
                  <Trash2 className="h-4 w-4 mr-1" /> Remover
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">PNG ou JPG, até 3MB.</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={profile?.email ?? ""} disabled />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Nascimento</Label>
              <Input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sobre / especialização</Label>
            <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <Button type="submit" disabled={mut.isPending}>Salvar alterações</Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* --------------------------- AGENDA SETTINGS --------------------------- */

const DAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terça" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sábado" },
];

function AgendaSection() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return { ...(data ?? {}), userId: u.user.id };
    },
  });

  const [agenda, setAgenda] = useState<AgendaSettings>(DEFAULT_AGENDA);

  useEffect(() => {
    const a = (profile?.address as any)?.agenda;
    if (a) setAgenda({ ...DEFAULT_AGENDA, ...a });
  }, [profile]);

  const mut = useMutation({
    mutationFn: async () => {
      if (!profile?.userId) throw new Error("Sessão expirada");
      const currentAddress: any = profile.address ?? {};
      const { error } = await supabase.from("profiles").upsert({
        id: profile.userId,
        address: { ...currentAddress, agenda },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agenda configurada");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleDay = (v: number) => {
    setAgenda((prev) => ({
      ...prev,
      hidden_days: prev.hidden_days.includes(v)
        ? prev.hidden_days.filter((d) => d !== v)
        : [...prev.hidden_days, v],
    }));
  };

  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Agenda</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Início dos atendimentos</Label>
              <Input
                type="number" min={0} max={23}
                value={agenda.start_hour}
                onChange={(e) => setAgenda({ ...agenda, start_hour: Number(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Hora do dia (0-23)</p>
            </div>
            <div className="space-y-2">
              <Label>Fim dos atendimentos</Label>
              <Input
                type="number" min={1} max={24}
                value={agenda.end_hour}
                onChange={(e) => setAgenda({ ...agenda, end_hour: Number(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Hora do dia (1-24)</p>
            </div>
            <div className="space-y-2">
              <Label>Duração da sessão (min)</Label>
              <Input
                type="number" min={10}
                value={agenda.session_duration}
                onChange={(e) => setAgenda({ ...agenda, session_duration: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ocultar dias da semana</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => {
                const hidden = agenda.hidden_days.includes(d.value);
                return (
                  <button
                    type="button"
                    key={d.value}
                    onClick={() => toggleDay(d.value)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition ${
                      hidden
                        ? "bg-muted text-muted-foreground line-through border-border"
                        : "bg-primary/10 text-primary border-primary/40"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Clique para ocultar/exibir na visualização semanal.</p>
          </div>

          <Button type="submit" disabled={mut.isPending}>Salvar agenda</Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* --------------------------- NOTIFICATIONS --------------------------- */

function NotificationsSection() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return { ...(data ?? {}), userId: u.user.id };
    },
  });

  const [notif, setNotif] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    const n = (profile?.address as any)?.notifications;
    if (n) setNotif({ ...DEFAULT_NOTIFICATIONS, ...n });
  }, [profile]);

  const mut = useMutation({
    mutationFn: async () => {
      if (!profile?.userId) throw new Error("Sessão expirada");
      const currentAddress: any = profile.address ?? {};
      const { error } = await supabase.from("profiles").upsert({
        id: profile.userId,
        address: { ...currentAddress, notifications: notif },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Notificações atualizadas");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const rows: { key: keyof NotificationSettings; label: string; desc: string }[] = [
    { key: "session_reminder", label: "Lembrete de sessão", desc: "Aviso no sino sobre sessões nas próximas 48h." },
    { key: "daily_agenda", label: "Resumo diário da agenda", desc: "Mostrar as sessões do dia no dashboard." },
    { key: "payment_alerts", label: "Alertas financeiros", desc: "Avisar sobre receitas e despesas pendentes." },
    { key: "email_notifications", label: "Notificações por e-mail", desc: "Receber avisos importantes por e-mail." },
  ];

  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Notificações</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
          {rows.map((r) => (
            <div key={r.key} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
              <div>
                <div className="font-medium text-sm">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </div>
              <Switch
                checked={notif[r.key]}
                onCheckedChange={(v) => setNotif({ ...notif, [r.key]: v })}
              />
            </div>
          ))}
          <Button type="submit" disabled={mut.isPending}>Salvar preferências</Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* --------------------------- PASSWORD --------------------------- */

function PasswordSection() {
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const mut = useMutation({
    mutationFn: async () => {
      if (pwd.length < 6) throw new Error("Mínimo 6 caracteres");
      if (pwd !== pwd2) throw new Error("As senhas não coincidem");
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Senha atualizada"); setPwd(""); setPwd2(""); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Alterar senha</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nova senha</Label>
              <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Confirmar</Label>
              <Input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={mut.isPending}>Atualizar senha</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AccountSection() {
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };
  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Conta</CardTitle></CardHeader>
      <CardContent>
        <Button variant="outline" onClick={signOut}>Sair da conta</Button>
      </CardContent>
    </Card>
  );
}
