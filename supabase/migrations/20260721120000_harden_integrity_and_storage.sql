-- Hardening for clinical data: guarantee that related records belong to
-- the same psychologist and create the private avatar bucket expected by the UI.

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', false)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.clients
  ADD CONSTRAINT clients_session_value_nonnegative
  CHECK (session_value IS NULL OR session_value >= 0);

ALTER TABLE public.sessions
  ADD CONSTRAINT sessions_duration_range
  CHECK (duration_min BETWEEN 10 AND 480),
  ADD CONSTRAINT sessions_value_nonnegative
  CHECK (value IS NULL OR value >= 0);

ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_amount_positive
  CHECK (amount > 0);

-- RLS prevents a user from reading another user's rows, but a foreign key by
-- itself does not prove that the referenced row has the same user_id. The
-- trigger enforces that invariant even when IDs are supplied directly.
CREATE OR REPLACE FUNCTION public.enforce_related_record_ownership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  related_user_id UUID;
  session_client_id UUID;
BEGIN
  IF TG_TABLE_NAME IN ('sessions', 'anamnesis', 'wheel_entries') THEN
    SELECT user_id
      INTO related_user_id
      FROM public.clients
     WHERE id = NEW.client_id;

    IF related_user_id IS DISTINCT FROM NEW.user_id THEN
      RAISE EXCEPTION 'The related client must belong to the same user'
        USING ERRCODE = '23514';
    END IF;
  ELSIF TG_TABLE_NAME = 'transactions' THEN
    IF NEW.client_id IS NOT NULL THEN
      SELECT user_id
        INTO related_user_id
        FROM public.clients
       WHERE id = NEW.client_id;

      IF related_user_id IS DISTINCT FROM NEW.user_id THEN
        RAISE EXCEPTION 'The related client must belong to the same user'
          USING ERRCODE = '23514';
      END IF;
    END IF;

    IF NEW.session_id IS NOT NULL THEN
      SELECT user_id, client_id
        INTO related_user_id, session_client_id
        FROM public.sessions
       WHERE id = NEW.session_id;

      IF related_user_id IS DISTINCT FROM NEW.user_id THEN
        RAISE EXCEPTION 'The related session must belong to the same user'
          USING ERRCODE = '23514';
      END IF;

      IF NEW.client_id IS NOT NULL AND session_client_id IS DISTINCT FROM NEW.client_id THEN
        RAISE EXCEPTION 'The transaction client must match the session client'
          USING ERRCODE = '23514';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_related_record_ownership() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER sessions_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

CREATE TRIGGER anamnesis_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id ON public.anamnesis
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

CREATE TRIGGER wheel_entries_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id ON public.wheel_entries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

CREATE TRIGGER transactions_enforce_related_owner
  BEFORE INSERT OR UPDATE OF user_id, client_id, session_id ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_related_record_ownership();

CREATE INDEX sessions_user_status_scheduled_idx
  ON public.sessions (user_id, status, scheduled_at);

CREATE INDEX transactions_user_kind_due_idx
  ON public.transactions (user_id, kind, due_date DESC);
