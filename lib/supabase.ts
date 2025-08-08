import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (we'll define these based on our schema)
export interface Recipe {
  id: string
  user_id: string
  title: string
  description: string
  image_url?: string
  ingredients: string[]
  steps: string[]
  category: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
} 