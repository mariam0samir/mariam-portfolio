import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — add them to .env (local) and to Vercel → Settings → Environment Variables.')
}

export const supabase = createClient(url || 'http://localhost', key || 'missing')
export const BUCKET = 'portfolio'
