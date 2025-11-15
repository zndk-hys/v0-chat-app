-- Create messages table for the chat app
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

-- Enable Row-Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read all messages
CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT
  USING (true);

-- RLS Policy: Anyone can insert messages
CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Anyone can delete their own messages (optional)
CREATE POLICY "Anyone can delete their own messages"
  ON messages FOR DELETE
  USING (true);
