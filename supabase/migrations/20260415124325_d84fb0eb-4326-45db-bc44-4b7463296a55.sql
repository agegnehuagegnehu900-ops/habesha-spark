
DROP POLICY "Anyone can view videos" ON storage.objects;
CREATE POLICY "Anyone can view video files" ON storage.objects FOR SELECT USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
