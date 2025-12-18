# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

## 2. Create the Profiles Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  is_pro BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policy: Anyone can insert (for signup)
CREATE POLICY "Anyone can insert profile"
  ON profiles
  FOR INSERT
  WITH CHECK (true);
```

## 3. Get Your API Keys

1. Go to Project Settings > API
2. Copy your:
   - Project URL
   - Anon/Public key

## 4. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Test Authentication

1. Run `npm run dev`
2. Open http://localhost:3000
3. Sign up with an email and password
4. You should get 3 free credits
5. Try getting roasted!

## Credit System

- **Free Tier**: 3 credits (3 roasts)
- **Pro Tier**: £9.99/month for 100 credits

When users run out of credits, they'll see an upgrade modal.

## Next Steps

To add payment functionality:
1. Integrate Stripe for payments
2. Set up webhooks to update `is_pro` and `credits` in the profiles table
3. Add subscription management
