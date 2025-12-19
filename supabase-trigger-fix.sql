-- Fix database trigger to give 3 credits on signup
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, credits, is_pro)
  VALUES (new.id, 3, false);
  RETURN new;
END;
$$;

-- Verify the trigger exists
-- If it doesn't exist, create it with:
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
