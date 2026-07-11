
CREATE POLICY "records own files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'medical-records' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'medical-records' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "records staff read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'medical-records' AND (public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin')));
