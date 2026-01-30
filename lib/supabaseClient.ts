
import { createClient } from '@supabase/supabase-js';

// NOTE: in a real production build, these should be in a .env file
// For this demo, please replace these with your actual Supabase credentials

// Safely access environment variables, falling back to an empty object if import.meta.env is undefined
const metaEnv = (import.meta as any).env || {};

const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
