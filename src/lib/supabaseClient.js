/* eslint-disable import/prefer-default-export */
import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://covhmgalupdvquvtghas.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvdmhtZ2FsdXBkdnF1dnRnaGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDA1MjcsImV4cCI6MjA3OTIxNjUyN30.RTnMwRFV_A9p7axu0WFcfIbWuATTBMQXFSLFoAB3yWQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
