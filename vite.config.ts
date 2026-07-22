import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Porta fixa para desenvolvimento local.
// Garante que o redirect URL do Supabase Dashboard seja sempre o mesmo.
// Configure em: Authentication > URL Configuration > Redirect URLs:
//   http://localhost:8080/auth/callback
export default defineConfig({
  server: {
    port: 8080,
    strictPort: false, // Se 8080 estiver ocupada, tenta a próxima disponível
  },
});
