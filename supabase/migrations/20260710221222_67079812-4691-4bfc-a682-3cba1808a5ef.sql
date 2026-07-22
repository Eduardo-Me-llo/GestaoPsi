
-- Enums
CREATE TYPE public.client_status AS ENUM ('ativo','inativo','desistente','alta','espera');
CREATE TYPE public.plan_type AS ENUM ('sessao','mensalidade');
CREATE TYPE public.wheel_type AS ENUM ('adolescente','adulto');

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  cpf TEXT,
  phone TEXT,
  birth_date DATE,
  avatar_url TEXT,
  address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  social_name TEXT,
  cpf TEXT,
  rg TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT,
  birth_date DATE,
  notes TEXT,
  status public.client_status NOT NULL DEFAULT 'ativo',
  plan_type public.plan_type NOT NULL DEFAULT 'sessao',
  session_value NUMERIC(10,2),
  group_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_own" ON public.clients FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX clients_user_idx ON public.clients(user_id);
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Wheel entries (history of wheel of life scores)
CREATE TABLE public.wheel_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  wheel_type public.wheel_type NOT NULL,
  scores JSONB NOT NULL,
  notes TEXT,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wheel_entries TO authenticated;
GRANT ALL ON public.wheel_entries TO service_role;
ALTER TABLE public.wheel_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wheel_entries_own" ON public.wheel_entries FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX wheel_entries_client_idx ON public.wheel_entries(client_id, wheel_type, taken_at DESC);
CREATE TRIGGER wheel_entries_updated_at BEFORE UPDATE ON public.wheel_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
