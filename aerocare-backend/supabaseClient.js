import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from your .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key. Check your .env file!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;