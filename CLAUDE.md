# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern recipe sharing platform built with Next.js 15, React 19, TypeScript, Supabase, and Tailwind CSS. It features user authentication, recipe management capabilities, and a responsive design optimized for both mobile and desktop.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production (must succeed before deployment)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linter
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run type-check` - Run TypeScript type checking (must pass)
- `npm run clean` - Clean build artifacts
- `npm run analyze` - Analyze bundle size with ANALYZE=true

### Quality Assurance Commands
Always run these before committing significant changes:
```bash
npm run lint && npm run type-check && npm run build
```

## Architecture & Key Technologies

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Authentication**: Supabase Auth with PKCE flow
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API for auth state
- **Deployment**: Vercel (recommended)

### Project Structure
```
app/                     # Next.js 15 App Router
├── auth/               # Authentication pages (/login, /register, /confirm)
├── components/         # Reusable UI components
├── contexts/           # React Context providers (AuthContext)
├── dashboard/          # Protected dashboard pages
└── globals.css         # Global Tailwind styles

lib/                    # Utility functions and configurations
├── auth.ts            # Authentication utilities and functions
└── supabase.ts        # Supabase client and type definitions
```

### Authentication Architecture

**Key Features:**
- Supabase Auth with email confirmation required
- PKCE flow for secure authentication
- Offline-first user profile fallback using metadata
- Resilient auth state management with periodic checks
- Row Level Security (RLS) policies for data protection

**Critical Files:**
- `lib/auth.ts` - Authentication functions and user management
- `lib/supabase.ts` - Supabase client configuration with optimized settings
- `app/contexts/AuthContext.tsx` - Auth state provider with comprehensive event handling
- `app/auth/confirm/page.tsx` - Email confirmation handling (simplified PKCE approach)

**Authentication Flow:**
1. User registers → Supabase sends confirmation email
2. User clicks email link → redirects to `/auth/confirm`
3. Supabase handles PKCE token exchange automatically
4. Session established → redirect to dashboard
5. Profile created/fetched from database with fallback to metadata

## Database Schema

Current tables in Supabase:
- `auth.users` - Managed by Supabase Auth
- `profiles` - User profile data linked to auth.users via RLS

Planned tables (not yet implemented):
- `recipes` - Recipe data with ingredients, steps, categories
- `bookmarks` - User recipe bookmarks

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Development Guidelines

### Code Style (from .cursor/rules/my-nextjs-rules.mdc)
- Use TypeScript for all code with strict type checking
- Prefer interfaces over types
- Use functional and declarative patterns
- Implement early returns for readability
- Use descriptive names with auxiliary verbs (isLoading, hasError)
- Prefix event handlers with "handle" (handleClick, handleSubmit)
- Favor named exports for components

### React/Next.js Best Practices
- Favor React Server Components where possible
- Minimize 'use client' directives
- Use Suspense for async operations
- Implement proper error boundaries
- Use `useActionState` instead of deprecated `useFormState`
- Handle async params in layouts/pages properly

### Authentication Development Notes
- **IMPORTANT**: The auth system uses a simplified approach that relies on Supabase's natural PKCE handling
- Avoid complex manual token parsing in confirmation flow
- The AuthContext includes fallback mechanisms for database connectivity issues
- Profile creation happens both during signup and as fallback in getCurrentUser()
- Always test auth flow end-to-end after making changes

### Known Issues & Solutions
- **Email Confirmation**: Uses simplified session polling approach, not manual PKCE handling
- **Middleware**: Has 3-second timeout protection to prevent hanging
- **Profile Creation**: Has fallback to user metadata if database is unavailable
- **Loading States**: Protected by timeout mechanisms to prevent infinite loading

## Testing Strategy

- TypeScript for type safety
- ESLint for code quality
- Manual testing of auth flows required
- Test both online and offline scenarios for auth
- Verify protected route access

## Deployment

See `DEPLOYMENT.md` for complete deployment instructions. Key points:
- Must pass `npm run lint` and `npm run type-check` before deployment
- Database schema must be applied in Supabase
- RLS policies must be active for security
- Environment variables must be set in deployment platform
- Recommended deployment: Vercel with auto-deploy from main branch

## Important Files to Review

When working on authentication:
- `lib/auth.ts:90-170` - getCurrentUser function with fallback logic
- `app/contexts/AuthContext.tsx:88-190` - Auth state change handling
- `app/auth/confirm/page.tsx` - Email confirmation implementation

When working on UI components:
- `tailwind.config.ts` - Custom theme with primary/secondary colors and animations
- `app/components/` - Reusable component library
- Follow existing component patterns for consistency

## Recent Major Fixes Applied

The codebase has undergone significant authentication improvements:
- Simplified email confirmation to rely on Supabase's natural PKCE flow
- Added timeout protection to prevent hanging middleware
- Implemented offline-first auth with metadata fallbacks
- Fixed redirect loops and authentication failures
- All build and linting issues resolved

Current build status: ✅ Production ready

## Tasks
* 1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
* 2. The plan should have a list of todo items that you can check off as you complete them
* 3. Before you begin working, check in with me and I will verify the plan.
* 4. Then, begin working on the todo items, marking them as complete as you go.
* 5. Please every step of the way just give me a high level explanation of what changes you made
* 6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.