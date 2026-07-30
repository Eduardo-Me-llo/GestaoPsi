DO $$ BEGIN
  DROP POLICY IF EXISTS "avatars_owner_all" ON storage.objects;
  CREATE POLICY "avatars_owner_all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN OTHERS THEN NULL; END $$;