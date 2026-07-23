-- Corrige a política RLS de wheel_entries para validar ownership através da tabela clients
-- Isso resolve o erro "The related client must belong to the same user"

DROP POLICY IF EXISTS "wheel_entries_own" ON public.wheel_entries;

CREATE POLICY "wheel_entries_own" ON public.wheel_entries FOR ALL TO authenticated
  USING (
    -- Permite acesso se:
    -- 1. O user_id da entrada corresponde ao usuário logado, OU
    -- 2. O cliente (client_id) pertence ao usuário logado
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = wheel_entries.client_id 
      AND clients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    -- Para INSERT/UPDATE, verifica se o cliente pertence ao usuário
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = wheel_entries.client_id 
      AND clients.user_id = auth.uid()
    )
  );
