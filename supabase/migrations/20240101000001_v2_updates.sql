-- V2.0 SCHEMA UPDATES

-- Add new location fields to members table
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Indonesia';

-- SENAPATI TV TABLE
CREATE TABLE IF NOT EXISTS public.senapati_tv (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- Dokumentasi Pementasan, Trailer, Behind the scenes, dll.
    youtube_id TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES FOR SENAPATI TV
ALTER TABLE public.senapati_tv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Senapati TV is viewable by everyone." 
ON public.senapati_tv FOR SELECT USING (true);

-- (Admins will have full access via a separate admin policy, but for now we just allow public read)
