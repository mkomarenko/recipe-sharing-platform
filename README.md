# 🍳 Recipe Sharing Platform

A modern, full-stack recipe sharing application built with Next.js 15, React 19, and Supabase.

## ✨ Features

### Authentication & User Management
- **🔐 Secure Authentication** - Email/password authentication with Supabase Auth and PKCE flow
- **✉️ Email Verification** - Required email confirmation for new accounts
- **👤 User Profiles** - Customizable profiles with avatar uploads, bio, website, and location
- **🔒 Protected Routes** - Secure dashboard and user-specific pages

### Recipe Management
- **➕ Create Recipes** - Full recipe creation with title, description, ingredients, steps, and images
- **✏️ Edit Recipes** - Update your own recipes with full edit capabilities
- **🗑️ Delete Recipes** - Remove recipes with automatic image cleanup
- **🖼️ Image Uploads** - Upload recipe images with Supabase Storage
- **🔐 Privacy Controls** - Set recipes as public or private
- **📊 Recipe Details** - Prep time, cook time, servings, difficulty level, and categories
- **🏷️ Tags & Categories** - 16 categories (Appetizer, Breakfast, Lunch, Dinner, Dessert, and more)

### Search & Discovery
- **🔍 Advanced Search** - Search by recipe title, tags, description, and ingredients
- **🎯 Category Filtering** - Filter recipes by category
- **⚡ Debounced Search** - Optimized search with debouncing to reduce API calls
- **📄 Browse All Recipes** - Dedicated page to explore all public recipes
- **⭐ Featured Recipes** - Homepage section with trending recipes
- **🆕 Latest Recipes** - Display newest recipe additions

### Bookmarks & Engagement
- **❤️ Bookmark System** - Save favorite recipes for later
- **📊 Bookmark Counts** - See how many users bookmarked each recipe
- **📚 My Bookmarks** - View all bookmarked recipes in your dashboard
- **👤 Author Information** - See recipe creators with their profile details

### Dashboard & Analytics
- **📊 User Dashboard** - Centralized view of your recipes and bookmarks
- **📈 Statistics** - Track your recipe count, bookmarks, and views
- **⚡ Quick Actions** - Easy access to create and browse recipes

### UI/UX
- **📱 Responsive Design** - Mobile-first design with Tailwind CSS
- **⚡ Performance** - Built with Next.js 15 and React 19 for optimal speed
- **🎨 Modern UI** - Clean, intuitive interface with smooth animations

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth with PKCE flow
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Storage**: Supabase Storage for images
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/recipe-sharing-platform.git
   cd recipe-sharing-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up your Supabase database:**
   - Create a new Supabase project
   - Run the SQL commands from `DEPLOYMENT.md` to create tables and policies

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### Core Tables

**`profiles`** - User profile information
- `id` (UUID, primary key) - Links to auth.users
- `username` (unique) - User's display name
- `full_name` - User's full name
- `avatar_url` - Profile picture URL
- `bio` - User biography (max 256 characters)
- `website` - Personal website URL
- `location` - User location
- `created_at`, `updated_at` - Timestamps

**`recipes`** - Recipe data
- `id` (UUID, primary key)
- `user_id` (foreign key) - Recipe creator
- `title` - Recipe name
- `description` - Recipe description
- `image_url` - Recipe image URL
- `ingredients` (JSONB) - Array of ingredients
- `steps` (JSONB) - Array of cooking steps
- `category` - Recipe category (Appetizer, Breakfast, Lunch, etc.)
- `tags` (array) - Searchable tags
- `prep_time` - Preparation time in minutes
- `cook_time` - Cooking time in minutes
- `servings` - Number of servings
- `difficulty` - easy, medium, or hard
- `is_public` (boolean) - Privacy setting
- `created_at`, `updated_at` - Timestamps

**`bookmarks`** - User recipe bookmarks
- `id` (UUID, primary key)
- `user_id` (foreign key) - User who bookmarked
- `recipe_id` (foreign key) - Bookmarked recipe
- `created_at` - Timestamp
- Unique constraint on (user_id, recipe_id)

### Storage Buckets

**`avatars`** - User profile pictures (public)
**`recipe-images`** - Recipe photos (public)

### Planned Tables (Not Yet Implemented)

**`recipe_ratings`** - User ratings and reviews
**`recipe_comments`** - User comments on recipes
**`user_follows`** - User follow relationships

### Security

- Row Level Security (RLS) policies on all tables
- Users can only edit/delete their own recipes
- Public recipes visible to all, private recipes only to owners
- Bookmarks are user-specific

## 📁 Project Structure

```
recipe-sharing-platform/
├── app/                        # Next.js 15 App Router
│   ├── auth/                   # Authentication pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── confirm/           # Email confirmation page
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── RecipeCard.tsx     # Recipe preview card
│   │   ├── RecipeAuthor.tsx   # Author information
│   │   ├── BookmarkButton.tsx # Bookmark toggle
│   │   ├── SearchSection.tsx  # Search and filters
│   │   └── ...more components
│   ├── contexts/              # React Context providers
│   │   └── AuthContext.tsx    # Authentication state
│   ├── dashboard/             # Protected user dashboard
│   │   └── page.tsx           # My recipes & bookmarks
│   ├── profile/               # User profile pages
│   │   ├── page.tsx           # View profile
│   │   └── edit/              # Edit profile
│   ├── recipes/               # Recipe-related pages
│   │   ├── page.tsx           # Browse all recipes
│   │   ├── [id]/              # Recipe detail page
│   │   ├── create/            # Create new recipe
│   │   └── edit/[id]/         # Edit existing recipe
│   ├── page.tsx               # Homepage
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global Tailwind styles
├── lib/                       # Utility functions & configs
│   ├── actions/               # Server actions
│   │   ├── recipes.ts         # Recipe CRUD operations
│   │   ├── bookmarks.ts       # Bookmark operations
│   │   └── profile.ts         # Profile operations
│   ├── auth.ts                # Authentication utilities
│   ├── supabase.ts            # Supabase client setup
│   └── validations.ts         # Zod schemas
├── middleware.ts              # Route protection
├── public/                    # Static assets
└── types/                     # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## 🌐 Pages & Routes

### Public Routes
- **`/`** - Homepage with search, featured recipes, and latest recipes
- **`/recipes`** - Browse all public recipes with search and filtering
- **`/recipes/[id]`** - View detailed recipe information
- **`/auth/login`** - User login
- **`/auth/register`** - User registration
- **`/auth/confirm`** - Email confirmation handler

### Protected Routes (Requires Authentication)
- **`/dashboard`** - User dashboard with personal recipes and bookmarks
- **`/profile`** - View user profile
- **`/profile/edit`** - Edit user profile
- **`/recipes/create`** - Create a new recipe
- **`/recipes/edit/[id]`** - Edit existing recipe (owner only)

## 👥 User Capabilities

### For Non-Authenticated Users
- Browse all public recipes on the homepage and browse page
- Search recipes by title, tags, ingredients, and description
- Filter recipes by category (16 available categories)
- View full recipe details including ingredients and instructions
- See recipe author information and bookmark counts
- Register for a new account
- Login to existing account

### For Authenticated Users
All non-authenticated features, plus:
- **Create Recipes** - Upload new recipes with images, ingredients, and steps
- **Edit Recipes** - Modify your own recipes at any time
- **Delete Recipes** - Remove your recipes (with automatic image cleanup)
- **Bookmark Recipes** - Save favorite recipes for quick access later
- **View Dashboard** - See all your recipes and bookmarks in one place
- **Track Statistics** - Monitor your recipe count, bookmarks received, and total views
- **Manage Profile** - Update profile picture, bio, website, and location
- **Privacy Controls** - Set recipes as public or private
- **Recipe Ownership** - Full control over your created recipes

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level security policies
- **Server-side Authentication** - Next.js middleware protection
- **Secure Cookies** - HTTP-only, secure cookies in production
- **CORS Protection** - Proper cross-origin request handling
- **Security Headers** - X-Frame-Options, Content-Type-Options, etc.
- **Email Verification** - Required confirmation for new accounts
- **PKCE Flow** - Secure authentication flow implementation

## 🧪 Testing

The application is ready for testing with:
- TypeScript for type safety
- ESLint for code quality
- Next.js built-in testing capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting section](./DEPLOYMENT.md#troubleshooting)
2. Review the [Supabase documentation](https://supabase.com/docs)
3. Check the [Next.js documentation](https://nextjs.org/docs)
4. Open an issue on GitHub

## 🗺️ Roadmap

### ✅ Completed Features
- [x] User authentication system with email verification
- [x] User profiles with avatar uploads
- [x] Recipe CRUD operations (Create, Read, Update, Delete)
- [x] Recipe search and filtering (title, tags, ingredients, categories)
- [x] Image uploads (recipes and avatars)
- [x] Bookmark system for saving favorite recipes
- [x] User dashboard with personal recipes and bookmarks
- [x] Browse recipes page with advanced search
- [x] Recipe detail pages with author information
- [x] Public/private recipe visibility controls

### 🚧 In Progress / Planned
- [ ] Recipe ratings and reviews
- [ ] Recipe comments and discussions
- [ ] Social features (user following, activity feed)
- [ ] Recipe collections/meal plans
- [ ] Shopping list generation from recipes
- [ ] Cooking mode (step-by-step instructions)
- [ ] Recipe sharing on social media
- [ ] Mobile app (React Native)
- [ ] Recipe import from URLs
- [ ] Nutritional information

---

**Built with ❤️ using Next.js 15 and Supabase**
