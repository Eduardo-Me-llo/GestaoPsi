
DO $$ BEGIN
  CREATE TYPE public.session_status AS ENUM ('agendada','realizada','faltou','cancelada');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE public.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  duration_min integer NOT NULL DEFAULT 50,
  status public.session_status NOT NULL DEFAULT 'agendada',
  room text,
  notes text,
  value numeric(10,2),
  paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_own ON public.sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX sessions_user_scheduled_idx ON public.sessions(user_id, scheduled_at);
CREATE INDEX sessions_client_idx ON public.sessions(client_id);
CREATE TRIGGER sessions_set_updated_at BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.anamnesis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  template_key text NOT NULL DEFAULT 'adulto',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  filled_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, template_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.anamnesis TO authenticated;
GRANT ALL ON public.anamnesis TO service_role;
ALTER TABLE public.anamnesis ENABLE ROW LEVEL SECURITY;
CREATE POLICY anamnesis_own ON public.anamnesis FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER anamnesis_set_updated_at BEFORE UPDATE ON public.anamnesis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
