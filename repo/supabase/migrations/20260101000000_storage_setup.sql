-- Create the 'malfunctions' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('malfunctions', 'malfunctions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to the bucket
-- Note: We use DO block to avoid error if policy already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Access Malfunctions'
    ) THEN
        CREATE POLICY "Public Access Malfunctions"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'malfunctions' );
    END IF;
END
$$;

-- Allow authenticated users to upload
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated Upload Malfunctions'
    ) THEN
        CREATE POLICY "Authenticated Upload Malfunctions"
        ON storage.objects FOR INSERT
        WITH CHECK ( bucket_id = 'malfunctions' AND auth.role() = 'authenticated' );
    END IF;
END
$$;
