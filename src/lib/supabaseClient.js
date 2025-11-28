/* eslint-disable import/prefer-default-export */
import {createClient} from '@supabase/supabase-js'

// 🟢 FIX: Read keys from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in the .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)