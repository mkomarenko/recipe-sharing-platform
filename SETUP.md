# RecipeShare Platform Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Once created, go to Settings > API
   - Copy your Project URL and anon/public key

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database schema:**
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
   );

   -- Create recipes table
   CREATE TABLE recipes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     image_url TEXT,
     ingredients JSONB NOT NULL,
     steps JSONB NOT NULL,
     category TEXT NOT NULL,
     tags TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create bookmarks table
   CREATE TABLE bookmarks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, recipe_id)
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

   -- Create policies for profiles
   CREATE POLICY "Profiles are viewable by everyone" ON profiles
     FOR SELECT USING (true);

   CREATE POLICY "Users can insert their own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can update their own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Create policies for recipes
   CREATE POLICY "Recipes are viewable by everyone" ON recipes
     FOR SELECT USING (true);

   CREATE POLICY "Users can insert their own recipes" ON recipes
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own recipes" ON recipes
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own recipes" ON recipes
     FOR DELETE USING (auth.uid() = user_id);

   -- Create policies for bookmarks
   CREATE POLICY "Bookmarks are viewable by owner" ON bookmarks
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
     FOR DELETE USING (auth.uid() = user_id);

   -- Create function to handle user creation
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS trigger AS $$
   BEGIN
     INSERT INTO public.profiles (id, username, full_name)
     VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
     RETURN new;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger to automatically create profile on user signup
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Current Features

- ✅ Modern, responsive home page
- ✅ Modular component architecture
- ✅ Navigation and layout structure
- ✅ Supabase client configuration
- ✅ Database schema with profiles table
- 🔄 Authentication (coming next)
- 🔄 Recipe CRUD operations
- 🔄 Image upload functionality
- 🔄 Search and filtering
- 🔄 Bookmarks system
- 🔄 User dashboard

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Forms:** React Hook Form + Zod validation
- **Deployment:** Vercel (recommended)

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page
├── globals.css            # Global styles
├── components/
│   ├── index.ts           # Component exports
│   ├── Header.tsx         # Navigation header
│   ├── HeroSection.tsx    # Hero section
│   ├── SearchSection.tsx  # Search and filters
│   ├── RecipeCard.tsx     # Individual recipe card
│   ├── FeaturedRecipes.tsx # Featured recipes grid
│   ├── StatsSection.tsx   # Community statistics
│   └── Footer.tsx         # Footer component
lib/
├── supabase.ts            # Supabase client
```

## Database Schema

### Tables:

#### `profiles`
- `id` (UUID, PK, FK to auth.users)
- `username` (TEXT, UNIQUE, NOT NULL)
- `full_name` (TEXT, NOT NULL)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT (NOW() AT TIME ZONE 'UTC'))
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT (NOW() AT TIME ZONE 'UTC'))

#### `recipes`
- `id` (UUID, PK)
- `user_id` (UUID, FK to auth.users)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `image_url` (TEXT)
- `ingredients` (JSONB, NOT NULL)
- `steps` (JSONB, NOT NULL)
- `category` (TEXT, NOT NULL)
- `tags` (TEXT[], DEFAULT '{}')
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

#### `bookmarks`
- `id` (UUID, PK)
- `user_id` (UUID, FK to auth.users)
- `recipe_id` (UUID, FK to recipes)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### Row Level Security Policies:

#### Profiles:
- **SELECT**: Everyone can view profiles
- **INSERT**: Users can create their own profile
- **UPDATE**: Users can update their own profile

#### Recipes:
- **SELECT**: Everyone can view recipes
- **INSERT**: Users can create their own recipes
- **UPDATE**: Users can update their own recipes
- **DELETE**: Users can delete their own recipes

#### Bookmarks:
- **SELECT**: Users can view their own bookmarks
- **INSERT**: Users can create their own bookmarks
- **DELETE**: Users can delete their own bookmarks

## Component Architecture

The application follows a modular component architecture:

- **Header**: Navigation bar with logo and menu items
- **HeroSection**: Main landing section with call-to-action
- **SearchSection**: Search bar and category filters
- **RecipeCard**: Reusable card component for recipe display
- **FeaturedRecipes**: Grid layout for featured recipes
- **StatsSection**: Community statistics display
- **Footer**: Site footer with links and information

## Next Steps

1. Implement authentication (login/register pages)
2. Create recipe creation form
3. Build recipe detail pages
4. Add search and filtering functionality
5. Implement bookmarks system
6. Create user dashboard
7. Add image upload to Supabase Storage
8. Deploy to Vercel 