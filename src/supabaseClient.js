import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fjgolccdkwnfjqbhndti.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZ29sY2Nka3duZmpxYmhuZHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNzE5NjYsImV4cCI6MjA0Njc0Nzk2Nn0.R202Q9yQDTOBWUiqkb4RuPu1rT9ydJShJI3fHK6h4nM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

