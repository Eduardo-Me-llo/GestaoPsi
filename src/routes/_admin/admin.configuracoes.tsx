import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logAudit } from "@/lib/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Image, ShieldAlert, Mail, SlidersHorizontal, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/configuracoes")({
  component: SystemSettingsPage,
});

type Settings = {
  platform_name: string;
  logo_url: string | null;
  institutional_data: {
    company_name?: string;
    cnpj?: string;
    support_email?: string;
    phone?: string;
    address?: string;
  };
  auth_settings: {
    allow_email_signup?: boolean;
    allow_google?: boolean;
    require_email_confirmation?: boolean;
  };
  email_settings: {
    from_name?: string;
    from_email?: string;
    smtp_host?: string;
  };
  general_params: {
    default_session_duration?: number;
    timezone?: string;
  };
  security_settings: {
    session_timeout_min?: number;
    enforce_strong_password?: boolean;
  };
};

const empty: Settings = {
  platform_name: "GestãoPsi",
  logo_url: null,
  institutional_data: {},
  auth_settings: {},
  email_settings: {},
  general_params: {},
  security_settings: {},
};

function SystemSettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Settings>(empty);

  const { data, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("system_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        platform_name: data.platform_name ?? "GestãoPsi",
        logo_url: data.logo_url ?? null,
        institutional_data: data.institutional_data ?? {},
        auth_settings: data.auth_settings ?? {},
        email_settings: data.email_settings ?? {},
        general_params: data.general_params ?? {},
        security_settings: data.security_settings ?? {},
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("system_settings")
        .update({
          platform_name: form.platform_name,
          logo_url: form.logo_url,
          institutional_data: form.institutional_data,
          auth_settings: form.auth_settings,
          email_settings: form.email_settings,
          general_params: form.general_params,
          security_settings: form.security_settings,
        })
        .eq("id", true);
      if (error) throw error;
      await logAudit({ action: "settings_update", entity: "system_settings" });
    },
    onSuccess: () => { toast.success("Configurações salvas."); qc.invalidateQueries({ queryKey: ["system-settings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const setInst = (k: keyof Settings["institutional_data"], v: string) =>
    setForm((f) => ({ ...f, institutional_data: { ...f.institutional_data, [k]: v } }));
  const setAuth = (k: keyof Settings["auth_settings"], v: boolean) =>
    setForm((f) => ({ ...f, auth_settings: { ...f.auth_settings, [k]: v } }));
  const setEmail = (k: keyof Settings["email_settings"], v: string) =>
    setForm((f) => ({ ...f, email_settings: { ...f.email_settings, [k]: v } }));
  const setSec = (k: keyof Settings["security_settings"], v: boolean | number) =>
    setForm((f) => ({ ...f, security_settings: { ...f.security_settings, [k]: v } }));

  if (isLoading) return <p className="text-sm text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Configurações do sistema</h1>
          <p className="text-muted-foreground mt-1">Parâmetros globais da plataforma.</p>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          <Save className="h-4 w-4 mr-2" />Salvar alterações
        </Button>
      </div>

      {/* Identidade da plataforma */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2"><Image className="h-4 w-4 text-primary" />Identidade</CardTitle>
          <CardDescription>Nome e logo exibidos no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome da plataforma</Label>
            <Input value={form.platform_name} onChange={(e) => setForm({ ...form, platform_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>URL do logo</Label>
            <Input value={form.logo_url ?? ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value || null })} placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      {/* Dados institucionais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />Dados institucionais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Razão social</Label>
            <Input value={form.institutional_data.company_name ?? ""} onChange={(e) => setInst("company_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input value={form.institutional_data.cnpj ?? ""} onChange={(e) => setInst("cnpj", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-mail de suporte</Label>
            <Input type="email" value={form.institutional_data.support_email ?? ""} onChange={(e) => setInst("support_email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.institutional_data.phone ?? ""} onChange={(e) => setInst("phone", e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Endereço</Label>
            <Textarea value={form.institutional_data.address ?? ""} onChange={(e) => setInst("address", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Autenticação */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary" />Autenticação</CardTitle>
          <CardDescription>Estes parâmetros são preferências do painel. A aplicação efetiva de alguns depende também do Supabase Dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Permitir cadastro por e-mail/senha" checked={form.auth_settings.allow_email_signup ?? true} onChange={(v) => setAuth("allow_email_signup", v)} />
          <ToggleRow label="Permitir login com Google" checked={form.auth_settings.allow_google ?? true} onChange={(v) => setAuth("allow_google", v)} />
          <ToggleRow label="Exigir confirmação de e-mail" checked={form.auth_settings.require_email_confirmation ?? false} onChange={(v) => setAuth("require_email_confirmation", v)} />
        </CardContent>
      </Card>

      {/* E-mail */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />Configurações de e-mail</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome do remetente</Label>
            <Input value={form.email_settings.from_name ?? ""} onChange={(e) => setEmail("from_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-mail do remetente</Label>
            <Input type="email" value={form.email_settings.from_email ?? ""} onChange={(e) => setEmail("from_email", e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Servidor SMTP</Label>
            <Input value={form.email_settings.smtp_host ?? ""} onChange={(e) => setEmail("smtp_host", e.target.value)} placeholder="smtp.exemplo.com" />
          </div>
        </CardContent>
      </Card>

      {/* Parâmetros gerais + segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-primary" />Parâmetros gerais e segurança</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Duração padrão da sessão (min)</Label>
            <Input
              type="number"
              value={form.general_params.default_session_duration ?? 50}
              onChange={(e) => setForm((f) => ({ ...f, general_params: { ...f.general_params, default_session_duration: Number(e.target.value) } }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Fuso horário</Label>
            <Input value={form.general_params.timezone ?? "America/Sao_Paulo"} onChange={(e) => setForm((f) => ({ ...f, general_params: { ...f.general_params, timezone: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label>Timeout de sessão (min)</Label>
            <Input
              type="number"
              value={form.security_settings.session_timeout_min ?? 60}
              onChange={(e) => setSec("session_timeout_min", Number(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <ToggleRow label="Exigir senha forte" checked={form.security_settings.enforce_strong_password ?? false} onChange={(v) => setSec("enforce_strong_password", v)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
