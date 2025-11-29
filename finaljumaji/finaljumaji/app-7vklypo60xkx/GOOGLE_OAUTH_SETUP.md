# Google OAuth Setup Guide for FlowGuide Personal

## Overview
This guide explains how to enable Google OAuth authentication in your FlowGuide Personal application using Supabase.

## Current Status
✅ **Code Implementation**: Google OAuth is fully implemented in the application
⚠️ **Supabase Configuration**: Requires manual setup in Supabase dashboard

## Prerequisites
- Access to your Supabase project dashboard
- A Google Cloud Platform account
- Your application's production URL

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**

### 1.2 Create OAuth 2.0 Client ID
1. Click **Create Credentials** > **OAuth client ID**
2. Select **Web application** as the application type
3. Configure the following:
   - **Name**: FlowGuide Personal
   - **Authorized JavaScript origins**: 
     - `https://umvtueotlsvuzneocpat.supabase.co`
     - Your production domain (e.g., `https://yourdomain.com`)
   - **Authorized redirect URIs**:
     - `https://umvtueotlsvuzneocpat.supabase.co/auth/v1/callback`
4. Click **Create**
5. Save your **Client ID** and **Client Secret**

## Step 2: Configure Supabase

### 2.1 Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `umvtueotlsvuzneocpat`
3. Navigate to **Authentication** > **Providers**

### 2.2 Enable Google Provider
1. Find **Google** in the list of providers
2. Toggle it to **Enabled**
3. Enter your Google OAuth credentials:
   - **Client ID**: (from Step 1.2)
   - **Client Secret**: (from Step 1.2)
4. Click **Save**

### 2.3 Configure Redirect URLs
1. In Supabase, go to **Authentication** > **URL Configuration**
2. Add your site URL:
   - **Site URL**: Your production domain
3. Add redirect URLs:
   - `https://yourdomain.com/dashboard`
   - `http://localhost:5173/dashboard` (for local development)

## Step 3: Test Google OAuth

### 3.1 Test Login Flow
1. Navigate to the login page
2. Click **Continue with Google**
3. You should be redirected to Google's consent screen
4. After authorization, you'll be redirected back to `/dashboard`

### 3.2 Verify User Creation
1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Verify that new users are created with Google OAuth
3. Check that the `profiles` table is populated via the trigger

## Troubleshooting

### Error: "Provider not enabled"
**Solution**: Ensure Google OAuth is enabled in Supabase Authentication settings

### Error: "Redirect URI mismatch"
**Solution**: 
1. Verify redirect URIs in Google Cloud Console match Supabase callback URL
2. Check that Site URL is configured correctly in Supabase

### Error: "Invalid OAuth configuration"
**Solution**: 
1. Double-check Client ID and Client Secret in Supabase
2. Ensure credentials are from the correct Google Cloud project

### Users can't log in after OAuth
**Solution**: 
1. Check that the `profiles` table trigger is working
2. Verify RLS policies allow user access
3. Check browser console for errors

## Code Implementation Details

### Login Page (`src/pages/LoginPage.tsx`)
- Implements `signInWithOAuth` with Google provider
- Handles OAuth errors with user-friendly messages
- Redirects to `/dashboard` after successful authentication

### Signup Page (`src/pages/SignupPage.tsx`)
- Same OAuth implementation as login
- Users can sign up with Google or username/password

### OAuth Flow
1. User clicks "Continue with Google"
2. Application calls `supabase.auth.signInWithOAuth()`
3. User is redirected to Google consent screen
4. After consent, Google redirects to Supabase callback URL
5. Supabase processes the OAuth response
6. User is redirected to `/dashboard`
7. Profile is automatically created via database trigger

## Security Considerations

### OAuth Scopes
The application requests minimal scopes:
- Email address
- Basic profile information

### Data Storage
- User email and profile data are stored in Supabase
- No passwords are stored for OAuth users
- OAuth tokens are managed by Supabase

### RLS Policies
- Users can only access their own data
- Admin users have full access
- OAuth users follow the same security rules as password users

## Alternative: Username/Password Login

If Google OAuth is not configured, users can still:
1. Sign up with username and password
2. Log in with username and password
3. All features work identically

The application gracefully handles OAuth being disabled and shows appropriate error messages.

## Support

If you encounter issues:
1. Check Supabase logs: **Logs** > **Auth Logs**
2. Check browser console for client-side errors
3. Verify all configuration steps were completed
4. Test with username/password login as fallback

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
