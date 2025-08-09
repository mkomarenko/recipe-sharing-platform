# Authentication Testing Guide

## Prerequisites

Before testing the authentication flow, make sure you have:

1. **Supabase Project Setup**
   - Created a Supabase project
   - Executed the SQL schema from `SETUP.md`
   - Copied your project URL and anon key

2. **Environment Variables**
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Development Server**
   - Run `npm run dev`
   - Open http://localhost:3000

## Testing Scenarios

### 1. 🏠 Home Page Testing
- **URL**: `http://localhost:3000`
- **Expected**: Clean home page with "Login" and "Sign Up" buttons in header
- **Verify**: Navigation works, responsive design looks good

### 2. 📝 User Registration Testing
- **URL**: `http://localhost:3000/auth/register`
- **Test Cases**:
  
  **Valid Registration:**
  - Username: `testuser123`
  - Full Name: `Test User`
  - Email: `test@example.com`
  - Password: `TestPass123!`
  - Confirm Password: `TestPass123!`
  - **Expected**: Success message asking to check email
  
  **Validation Testing:**
  - Try short username (< 3 chars) → Should show error
  - Try weak password → Should show error
  - Try mismatched passwords → Should show error
  - Try invalid email → Should show error

### 3. 📧 Email Verification
- **Check**: Your email inbox for verification link
- **Action**: Click the verification link
- **Expected**: Email confirmed, account activated

### 4. 🔑 User Login Testing
- **URL**: `http://localhost:3000/auth/login`
- **Test Cases**:
  
  **Valid Login:**
  - Email: `test@example.com`
  - Password: `TestPass123!`
  - **Expected**: Redirect to dashboard
  
  **Invalid Login:**
  - Wrong password → Should show error
  - Unverified email → Should show error
  - Non-existent email → Should show error

### 5. 🏛️ Dashboard Access Testing
- **URL**: `http://localhost:3000/dashboard`
- **Authenticated**: Should show dashboard with user name
- **Unauthenticated**: Should redirect to login page

### 6. 🔒 Route Protection Testing
- **Test URLs** (should redirect to login if not authenticated):
  - `/dashboard`
  - `/recipes/create`
  - `/profile`
  
- **Test URLs** (should redirect to dashboard if authenticated):
  - `/auth/login`
  - `/auth/register`

### 7. 🧭 Header Navigation Testing
- **Unauthenticated**: Shows "Login" and "Sign Up" buttons
- **Authenticated**: Shows user avatar, dropdown menu with:
  - Dashboard
  - Profile
  - Sign Out

### 8. 🚪 Sign Out Testing
- **Action**: Click user avatar → Sign Out
- **Expected**: 
  - User logged out
  - Redirected to home page
  - Header shows login/signup buttons again

## Database Verification

Check your Supabase dashboard to verify:

### Users Table (`auth.users`)
- New user entries appear after registration
- Email confirmation status

### Profiles Table (`public.profiles`)
- Profile automatically created via trigger
- Username and full_name populated correctly

## Common Issues & Solutions

### 1. **"Invalid JWT" Error**
- **Cause**: Wrong Supabase credentials
- **Solution**: Check `.env.local` file values

### 2. **Email Not Received**
- **Cause**: Email delivery delay or spam folder
- **Solution**: Check spam, wait a few minutes, or use a real email

### 3. **Redirect Loop**
- **Cause**: Middleware configuration issue
- **Solution**: Check middleware.ts and route patterns

### 4. **Profile Not Created**
- **Cause**: Database trigger not working
- **Solution**: Verify SQL schema was executed correctly

### 5. **CORS Errors**
- **Cause**: Supabase domain restrictions
- **Solution**: Add `localhost:3000` to allowed origins in Supabase

## Testing Checklist

- [ ] Home page loads correctly
- [ ] Registration form validates input
- [ ] User can register successfully
- [ ] Email verification works
- [ ] User can login with verified account
- [ ] Dashboard shows correct user information
- [ ] Protected routes require authentication
- [ ] Header shows correct authentication state
- [ ] User can sign out successfully
- [ ] Profile data appears in database
- [ ] Middleware redirects work correctly

## Next Steps

Once authentication is working:
1. Test with multiple users
2. Test password reset flow (if implemented)
3. Test edge cases (expired sessions, etc.)
4. Move on to recipe CRUD implementation

## Debugging Tips

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API calls to Supabase
3. **Check Supabase Logs**: View authentication logs in dashboard
4. **Check Database**: Verify data is being created correctly
5. **Check Environment**: Ensure `.env.local` is loaded
