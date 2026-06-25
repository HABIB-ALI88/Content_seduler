-- Create auth_tokens table
CREATE TABLE IF NOT EXISTS auth_tokens (
    id integer PRIMARY KEY CHECK (id = 1),
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    open_id text NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- Insert the single row that we will update
INSERT INTO auth_tokens (id, access_token, refresh_token, expires_at, open_id)
VALUES (1, '', '', now(), '')
ON CONFLICT (id) DO NOTHING;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    video_url text NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
    tiktok_publish_id text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS) but since it's personal, we can just allow all for authenticated anon (or just disable RLS since we use service key backend)
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- If using service_role key in Next.js API, RLS is bypassed. 
-- For the frontend, if we want to read posts, we might want a policy:
CREATE POLICY "Allow anonymous read" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON posts FOR DELETE USING (true);
