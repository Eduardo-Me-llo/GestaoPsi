import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses hash on load; wait for session
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display">Redefinir senha</CardTitle>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <p className="text-sm text-muted-foreground">
              Abra este link a partir do e-mail que você recebeu para redefinir a senha.
            </p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (password.length < 6) return toast.error("Mínimo 6 caracteres.");
                setLoading(true);
                const { error } = await supabase.auth.updateUser({ password });
                setLoading(false);
                if (error) return toast.error(error.message);
                toast.success("Senha atualizada!");
                await supabase.auth.signOut();
                navigate({ to: "/auth", replace: true });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="p">Nova senha</Label>
                <Input id="p" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>Salvar</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
