import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ivbliqztcgatehdrtgvr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YmxpcXp0Y2dhdGVoZHJ0Z3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDcxMTksImV4cCI6MjA3NzMyMzExOX0.m_gWDcvfsvgJKcYxMbsJpOh6N7lrJ_nC0hT2ErZ6KQI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
