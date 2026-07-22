import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { logAudit } from "@/lib/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  // Formulário sempre visível por padrão
  const [emailMode, setEmailMode] = useState<"login" | "signup" | "forgot">(
    search.mode ?? "login",
  );

  useEffect(() => {
    // Se já há sessão ativa, vai direto para o dashboard
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
      }
    });

    // Captura SIGNED_IN vindo de qualquer fluxo (email/password ou OAuth redirect)
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate({ to: "/dashboard", replace: true });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/10 via-background to-primary-glow/10 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Brain className="h-7 w-7" />
          </div>
          <span className="font-display text-3xl font-bold text-foreground">
            GestãoPsi
          </span>
          <p className="text-sm text-muted-foreground text-center">
            Sistema de gestão para psicólogos
          </p>
        </div>

        <Card className="shadow-xl border-border/60">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-xl">Bem-vindo(a)</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Botão Google — opção principal */}
            <GoogleButton />

            {/* Separador */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>ou continue com e-mail</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Abas de modo — sempre visíveis */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["login", "signup", "forgot"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setEmailMode(mode)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    emailMode === mode
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {mode === "login"
                    ? "Entrar"
                    : mode === "signup"
                      ? "Cadastrar"
                      : "Recuperar"}
                </button>
              ))}
            </div>

            {emailMode === "login" && <LoginForm />}
            {emailMode === "signup" && (
              <SignupForm onDone={() => setEmailMode("login")} />
            )}
            {emailMode === "forgot" && <ForgotForm />}

            {/* Aviso de privacidade */}
            <p className="text-center text-xs text-muted-foreground pt-1 leading-relaxed">
              Ao entrar, você concorda com os{" "}
              <span className="underline cursor-pointer hover:text-foreground">
                Termos de Uso
              </span>{" "}
              e a{" "}
              <span className="underline cursor-pointer hover:text-foreground">
                Política de Privacidade
              </span>
              .
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Seus dados clínicos são protegidos com criptografia e Row Level
          Security.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Botão Google
// ---------------------------------------------------------------
function GoogleButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full h-12 font-medium border-border/80 hover:bg-muted/60 transition-all"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            // O Supabase redireciona para /auth/callback?code=...
            // após autenticação no Google. Essa rota troca o code por sessão
            // e navega para /dashboard.
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: "offline",
              prompt: "select_account",
            },
          },
        });
        if (error) {
          const msg = error.message.includes("provider is not enabled")
            ? "Login com Google não está habilitado no momento. Use e-mail e senha."
            : `Erro ao entrar com Google: ${error.message}`;
          toast.error(msg);
          setLoading(false);
        }
        // Sem erro → o browser é redirecionado ao Google automaticamente
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar com Google
        </span>
      )}
    </Button>
  );
}

// ---------------------------------------------------------------
// Formulário de Login
// ---------------------------------------------------------------
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        setLoading(false);
        if (error) {
          return toast.error(
            error.message === "Invalid login credentials"
              ? "E-mail ou senha incorretos."
              : error.message,
          );
        }
        await logAudit({ action: "login", details: { method: "email" } });
        toast.success("Bem-vindo(a) de volta!");
        navigate({ to: "/dashboard", replace: true });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="login-email">E-mail</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="login-pass">Senha</Label>
        <Input
          id="login-pass"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------
// Formulário de Cadastro
// ---------------------------------------------------------------
function SignupForm({ onDone }: { onDone: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password.length < 6)
          return toast.error("Senha deve ter ao menos 6 caracteres.");
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        setLoading(false);
        if (error) return toast.error(error.message);

        if (data.session) {
          toast.success("Conta criada. Boas-vindas ao GestãoPsi!");
          navigate({ to: "/dashboard", replace: true });
          return;
        }

        toast.info(
          "Conta criada. Verifique seu e-mail para confirmar o cadastro.",
        );
        onDone();
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="s-name">Nome completo</Label>
        <Input
          id="s-name"
          placeholder="Dr(a). João Silva"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-email">E-mail</Label>
        <Input
          id="s-email"
          type="email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-pass">Senha</Label>
        <Input
          id="s-pass"
          type="password"
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------
// Formulário de Recuperação de Senha
// ---------------------------------------------------------------
function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-lg bg-muted p-4 text-sm text-center text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">E-mail enviado!</p>
        <p>
          Verifique sua caixa de entrada e clique no link para redefinir a
          senha.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setLoading(false);
        if (error) return toast.error(error.message);
        setSent(true);
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="f-email">E-mail cadastrado</Label>
        <Input
          id="f-email"
          type="email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        variant="outline"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Enviar link de redefinição"
        )}
      </Button>
    </form>
  );
}
