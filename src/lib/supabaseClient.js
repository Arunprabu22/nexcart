/* eslint-disable import/prefer-default-export */
import {createClient} from '@supabase/supabase-js'

// 🛑 SOLUTION: Use process.env to read from the .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

// Optional: Add a check to prevent app startup if keys are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in the .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
