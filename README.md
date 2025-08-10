# 🍳 Recipe Sharing Platform

A modern, full-stack recipe sharing application built with Next.js 15, React 19, and Supabase.

## ✨ Features

- **🔐 Secure Authentication** - User registration, login, and email verification
- **👤 User Profiles** - Customizable user profiles with avatars
- **🍽️ Recipe Management** - Create, edit, and share recipes
- **🔍 Search & Discovery** - Find recipes by ingredients, categories, or tags
- **📱 Responsive Design** - Mobile-first design with Tailwind CSS
- **⚡ Performance** - Built with Next.js 15 and React 19 for optimal performance

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
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

The application uses the following main tables:

- **`auth.users`** - Supabase Auth users (auto-created)
- **`profiles`** - User profile information
- **`recipes`** - Recipe data (coming soon)
- **`bookmarks`** - User recipe bookmarks (coming soon)

## 📁 Project Structure

```
recipe-sharing-platform/
├── app/                    # Next.js 15 App Router
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── dashboard/         # Protected dashboard
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   └── supabase.ts       # Supabase client
├── middleware.ts          # Next.js middleware
└── public/                # Static assets
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

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level security policies
- **Server-side Authentication** - Next.js middleware protection
- **Secure Cookies** - HTTP-only, secure cookies in production
- **CORS Protection** - Proper cross-origin request handling
- **Security Headers** - X-Frame-Options, Content-Type-Options, etc.

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

- [x] User authentication system
- [x] User profiles
- [ ] Recipe CRUD operations
- [ ] Recipe search and filtering
- [ ] Image uploads
- [ ] Recipe ratings and reviews
- [ ] Social features (following, sharing)
- [ ] Mobile app (React Native)

---

**Built with ❤️ using Next.js 15 and Supabase**
