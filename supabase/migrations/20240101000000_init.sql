-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (Extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT NOT NULL,
    nickname TEXT,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    photo_url TEXT,
    role TEXT DEFAULT 'user', -- Admin, Management, Active Member, Alumni, Volunteer, Sponsor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MEMBERS TABLE
CREATE TABLE public.members (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    member_status TEXT NOT NULL,
    generation_number INTEGER,
    join_year INTEGER,
    graduation_year INTEGER,
    role_in_theater TEXT,
    biography TEXT,
    profession TEXT,
    city TEXT,
    instagram TEXT,
    linkedin TEXT,
    skills TEXT[],
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTIONS TABLE
CREATE TABLE public.productions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- Drama, Musical, etc.
    production_year INTEGER NOT NULL,
    synopsis TEXT,
    director TEXT,
    poster_url TEXT,
    trailer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- EVENTS TABLE
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    registration_limit INTEGER,
    category TEXT, -- Workshop, Rehearsal, Festival, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ARCHIVES (DIGITAL MUSEUM) TABLE
CREATE TABLE public.archives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- Script, Poster, Photo, Video, Newspaper, Award
    description TEXT,
    file_url TEXT NOT NULL,
    year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SPONSORS TABLE
CREATE TABLE public.sponsors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    tier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GALLERIES TABLE
CREATE TABLE public.galleries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    production_id UUID REFERENCES public.productions(id),
    title TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Allow public read access for specific tables
CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Public members are viewable by everyone." ON public.members FOR SELECT USING (approved = true);
CREATE POLICY "Productions are viewable by everyone." ON public.productions FOR SELECT USING (true);
CREATE POLICY "Events are viewable by everyone." ON public.events FOR SELECT USING (true);
CREATE POLICY "Archives are viewable by everyone." ON public.archives FOR SELECT USING (true);
CREATE POLICY "Sponsors are viewable by everyone." ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Galleries are viewable by everyone." ON public.galleries FOR SELECT USING (true);

-- Allow authenticated users to insert/update their own profile
CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own member details
CREATE POLICY "Users can insert their own member details." ON public.members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own member details." ON public.members FOR UPDATE USING (auth.uid() = user_id);

-- Storage bucket for media assets (Assuming we create 'senapati-media')
-- (Storage policies would be handled in the Supabase Dashboard or via API)
