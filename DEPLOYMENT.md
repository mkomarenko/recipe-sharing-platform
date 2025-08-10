# 🚀 Production Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase project set up
- Environment variables configured
- Database schema created

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Fill in your Supabase credentials:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

## Database Setup

1. **Create the profiles table in Supabase:**
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Enable Row Level Security (RLS):**
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ```

3. **Create RLS policies:**
   ```sql
   -- Users can read their own profile
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);
   
   -- Users can update their own profile
   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);
   
   -- Users can insert their own profile
   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);
   ```

## Build and Test

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run linting:**
   ```bash
   npm run lint
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```

4. **Test the build locally:**
   ```bash
   npm start
   ```

## Deployment Options

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Netlify

1. **Connect your GitHub repository to Netlify**
2. **Set build command:** `npm run build`
3. **Set publish directory:** `.next`
4. **Set environment variables in Netlify dashboard**

### Self-Hosted

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

3. **Use a process manager like PM2:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "recipe-app" -- start
   ```

## Security Checklist

- [ ] Environment variables are properly set
- [ ] HTTPS is enabled in production
- [ ] RLS policies are active in Supabase
- [ ] Authentication is working correctly
- [ ] Protected routes are secured
- [ ] CORS is properly configured
- [ ] Security headers are set

## Performance Optimization

- [ ] Images are optimized (WebP/AVIF)
- [ ] Code splitting is enabled
- [ ] Bundle analyzer shows reasonable sizes
- [ ] Core Web Vitals are good
- [ ] Database queries are optimized

## Monitoring

1. **Set up error tracking (e.g., Sentry)**
2. **Monitor Core Web Vitals**
3. **Set up uptime monitoring**
4. **Monitor Supabase usage and limits**

## Troubleshooting

### Common Issues

1. **Authentication not working:**
   - Check environment variables
   - Verify Supabase project settings
   - Check RLS policies

2. **Build failures:**
   - Check Node.js version
   - Clear `.next` folder
   - Check for TypeScript errors

3. **Runtime errors:**
   - Check browser console
   - Verify API endpoints
   - Check database connections

### Support

- Check Supabase documentation
- Review Next.js deployment guide
- Check environment variable configuration
