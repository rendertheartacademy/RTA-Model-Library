
-- 1. Create the Subscriptions Table
-- We use IF NOT EXISTS to avoid errors if running multiple times
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  telegram_username TEXT NOT NULL UNIQUE, -- Unique constraint as requested
  
  plan_tier TEXT NOT NULL, -- 'Essential', 'Professional', 'Premium'
  plan_duration TEXT NOT NULL, -- '3 Months', '6 Months', '12 Months'
  
  -- NEW: Split Currency Columns
  amount_mmk TEXT, -- Stores amount if paid via KBZPay (e.g. '24,000 MMK')
  amount_thb TEXT, -- Stores amount if paid via Thai Bank (e.g. '941.4 THB')
  amount_paid TEXT, -- DEPRECATED: Kept for legacy data, now nullable
  
  is_rta_student BOOLEAN DEFAULT FALSE,
  rta_class_name TEXT, 
  software_format TEXT, 
  
  payment_method TEXT NOT NULL,
  payment_slip_url TEXT NOT NULL,
  
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);

-- 2. Create the Trigger Function for Date Calculation
CREATE OR REPLACE FUNCTION handle_subscription_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if status changed to 'approved'
  -- OLD is the record before update, NEW is the record after update
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    
    -- Set Start Date to NOW (Current Time)
    NEW.start_date := NOW();
    
    -- Calculate End Date based on duration + 3 Days Bonus
    IF NEW.plan_duration = '12 Months' THEN
        NEW.end_date := NOW() + INTERVAL '1 year' + INTERVAL '3 days';
    ELSIF NEW.plan_duration = '6 Months' THEN
        NEW.end_date := NOW() + INTERVAL '6 months' + INTERVAL '3 days';
    ELSIF NEW.plan_duration = '3 Months' THEN
        NEW.end_date := NOW() + INTERVAL '3 months' + INTERVAL '3 days';
    ELSE
        -- Fallback default (30 days) if string doesn't match
        NEW.end_date := NOW() + INTERVAL '30 days'; 
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach the Trigger to the Table
-- Drop trigger if exists to allow re-running script
DROP TRIGGER IF EXISTS trigger_auto_date_calculation ON public.subscriptions;

CREATE TRIGGER trigger_auto_date_calculation
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION handle_subscription_approval();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (Sign up)
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.subscriptions;
CREATE POLICY "Enable insert for everyone" ON public.subscriptions FOR INSERT WITH CHECK (true);

-- Policy: Allow public read (For the 'Check Status' page)
-- In a stricter app, you would filter this by auth.uid(), but for this frontend logic:
DROP POLICY IF EXISTS "Enable read access" ON public.subscriptions;
CREATE POLICY "Enable read access" ON public.subscriptions FOR SELECT USING (true);

-- Policy: Allow updates (If you want to update from Supabase Dashboard, this is auto-enabled for admins, 
-- but if you built an admin panel app, you'd need a policy here).

-- 5. Storage Setup
-- Create the bucket for payment slips
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-slips', 'payment-slips', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public uploads (Anyone can upload a receipt)
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
CREATE POLICY "Public Uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK ( bucket_id = 'payment-slips' );

-- Policy: Allow public reads (So admin can view receipts)
DROP POLICY IF EXISTS "Public Reads" ON storage.objects;
CREATE POLICY "Public Reads" 
ON storage.objects 
FOR SELECT 
USING ( bucket_id = 'payment-slips' );
