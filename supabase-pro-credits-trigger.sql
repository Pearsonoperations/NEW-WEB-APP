-- Trigger to automatically set credits to 100 when user becomes Pro
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.handle_pro_upgrade()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- If user is being upgraded to Pro and credits weren't explicitly set
  IF NEW.is_pro = true AND OLD.is_pro = false THEN
    -- Only set credits to 100 if they weren't already set in the same update
    IF NEW.credits = OLD.credits THEN
      NEW.credits := 100;
    END IF;
  END IF;

  -- If user is being downgraded from Pro
  IF NEW.is_pro = false AND OLD.is_pro = true THEN
    -- Only set credits to 3 if they weren't already set in the same update
    IF NEW.credits = OLD.credits THEN
      NEW.credits := 3;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_pro_status_change ON public.profiles;

CREATE TRIGGER on_pro_status_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.is_pro IS DISTINCT FROM NEW.is_pro)
  EXECUTE FUNCTION public.handle_pro_upgrade();
