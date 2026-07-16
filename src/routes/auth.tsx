import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Brain } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "forgot"]).optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"login" | "signup" | "forgot">(search.mode ?? "login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/10 via-background to-primary-glow/10 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2 text-primary">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-display text-2xl font-bold">GestãoPsi</span>
        </div>

        <Card className="shadow-xl border-border/60">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Bem-vindo(a)</CardTitle>
            <CardDescription>Acesse sua conta para gerenciar seus atendimentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                <TabsTrigger value="forgot">Recuperar</TabsTrigger>
              </TabsList>
              <TabsContent value="login"><LoginForm /></TabsContent>
              <TabsContent value="signup"><SignupForm onDone={() => setTab("login")} /></TabsContent>
              <TabsContent value="forgot"><ForgotForm /></TabsContent>
            </Tabs>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              OU
              <div className="h-px flex-1 bg-border" />
            </div>

            <GoogleButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) return toast.error(error.message);
        toast.success("Bem-vindo(a) de volta!");
        navigate({ to: "/dashboard", replace: true });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">E-mail</Label>
        <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-pass">Senha</Label>
        <Input id="login-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
      </Button>
    </form>
  );
}

function SignupForm({ onDone }: { onDone: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password.length < 6) return toast.error("Senha deve ter ao menos 6 caracteres.");
        setLoading(true);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName },
          },
        });
        setLoading(false);
        if (error) return toast.error(error.message);
        toast.success("Cadastro criado! Confirme seu e-mail e faça login.");
        onDone();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="s-name">Nome completo</Label>
        <Input id="s-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="s-email">E-mail</Label>
        <Input id="s-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="s-pass">Senha</Label>
        <Input id="s-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
      </Button>
    </form>
  );
}

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setLoading(false);
        if (error) return toast.error(error.message);
        toast.success("Enviamos um link de redefinição para seu e-mail.");
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="f-email">E-mail</Label>
        <Input id="f-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" variant="outline" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar link"}
      </Button>
    </form>
  );
}

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          toast.error("Falha ao entrar com Google.");
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path fill="#EA4335" d="M12 10.2v3.8h5.4c-.24 1.4-1.66 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.08.79 3.79 1.46l2.58-2.48C16.85 3.3 14.7 2.4 12 2.4 6.85 2.4 2.7 6.55 2.7 11.7s4.15 9.3 9.3 9.3c5.36 0 8.9-3.77 8.9-9.08 0-.61-.07-1.08-.16-1.55H12z"/>
          </svg>
          Continuar com Google
        </span>
      )}
    </Button>
  );
}
