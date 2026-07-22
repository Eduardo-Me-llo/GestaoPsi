/**
 * Rota de callback OAuth — /auth/callback
 *
 * O Supabase redireciona aqui após autenticação Google com:
 *  - Fluxo PKCE (padrão): query param ?code=...
 *  - Fluxo implícito (legado): fragment #access_token=...
 *
 * Esta rota trata ambos os casos, estabelece a sessão
 * e redireciona ao dashboard.
 *
 * Configure no Supabase Dashboard > Authentication > URL Configuration:
 *   Site URL:      http://localhost:8080
 *   Redirect URLs: http://localhost:8080/auth/callback
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Brain, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false); // evita double-invoke no StrictMode

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    async function handleCallback() {
      const url = new URL(window.location.href);

      // ── Fluxo PKCE: o Supabase envia ?code=... na query string ──────────
      const code = url.searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(`Falha ao verificar sessão: ${exchangeError.message}`);
          return;
        }
        // Sessão estabelecida — vai para o dashboard
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      // ── Fluxo implícito: #access_token=... no fragment ──────────────────
      // O Supabase JS SDK detecta e processa o fragment automaticamente.
      // Aguardamos o evento SIGNED_IN via onAuthStateChange.
      const hash = url.hash;
      if (hash && hash.includes("access_token")) {
        // O SDK já está processando — apenas esperamos o evento
        const { data: sub } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === "SIGNED_IN" && session) {
              sub.subscription.unsubscribe();
              navigate({ to: "/dashboard", replace: true });
            }
          },
        );

        // Timeout de segurança: se em 5s não vier SIGNED_IN, verifica sessão
        const timer = setTimeout(async () => {
          sub.subscription.unsubscribe();
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            navigate({ to: "/dashboard", replace: true });
          } else {
            setError(
              "Tempo esgotado ao processar o login. Tente novamente.",
            );
          }
        }, 5000);

        return () => {
          clearTimeout(timer);
          sub.subscription.unsubscribe();
        };
      }

      // ── Sem parâmetros: verifica se já há sessão ativa ──────────────────
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      // Nada encontrado — redireciona para login
      navigate({ to: "/auth", replace: true });
    }

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="font-medium text-foreground">Erro no login</p>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {error}
        </p>
        <Button variant="outline" asChild>
          <a href="/auth">Voltar para o login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
        <Brain className="h-7 w-7" />
      </div>
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Verificando sua conta…</p>
    </div>
  );
}
