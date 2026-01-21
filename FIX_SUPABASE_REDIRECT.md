# Fix Supabase Redirect: lazyexcel.pro → easyexcel.in

## Problem
When logging in from `lazyexcel.pro`, users are redirected to `easyexcel.in` after authentication.

## Root Cause
Supabase has a whitelist of allowed redirect URLs. If `lazyexcel.pro` is not in this list, Supabase redirects to the default/fallback URL (likely `easyexcel.in`).

## Solution: Update Supabase Redirect URLs

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project (the one used for LazyExcel)

### Step 2: Navigate to Authentication Settings
1. Click **"Authentication"** in the left sidebar
2. Click **"URL Configuration"** (or look for "Redirect URLs" / "Site URL")

### Step 3: Update Site URL (Primary)
1. Find the **"Site URL"** field
2. Change it to: `https://www.lazyexcel.pro` (or `https://lazyexcel.pro` if you prefer without www)
3. Click **"Save"**

### Step 4: Add Redirect URLs (Whitelist)
1. Find the **"Redirect URLs"** section (or "Additional Redirect URLs")
2. Add the following URLs (one per line or comma-separated):
   ```
   https://www.lazyexcel.pro
   https://lazyexcel.pro
   https://www.lazyexcel.pro/*
   https://lazyexcel.pro/*
   https://www.easyexcel.in
   https://easyexcel.in
   https://www.easyexcel.in/*
   https://easyexcel.in/*
   ```
3. **Important:** Include both `www` and non-`www` versions
4. **Important:** Include both `lazyexcel.pro` and `easyexcel.in` if you want both to work
5. Click **"Save"**

### Step 5: Verify OAuth Providers (if using Google OAuth)
1. Still in **Authentication** section
2. Click **"Providers"** (or "OAuth Providers")
3. Click on **"Google"** (or your OAuth provider)
4. Check the **"Redirect URL"** field
5. Make sure it includes both domains or is set to accept any from your whitelist
6. Save if you made changes

## Expected Result

After updating:
- ✅ Users logging in from `lazyexcel.pro` will stay on `lazyexcel.pro`
- ✅ Users logging in from `easyexcel.in` will stay on `easyexcel.in`
- ✅ OAuth redirects (Google) will work correctly for both domains

## Testing

1. **Clear browser cache and cookies** (important!)
2. Visit: `https://www.lazyexcel.pro`
3. Click "Sign in" or "Login"
4. Complete authentication
5. **Verify:** You should remain on `lazyexcel.pro` after login, not redirect to `easyexcel.in`

## Common Issues

### Issue: Still redirecting to easyexcel.in
**Solution:**
- Double-check that you added both `www` and non-`www` versions
- Clear browser cache completely
- Try in incognito/private browsing mode
- Wait a few minutes for Supabase to propagate changes

### Issue: OAuth (Google) not working
**Solution:**
- Make sure Google OAuth provider has the correct redirect URLs
- Check Google Cloud Console OAuth settings match Supabase redirect URLs

### Issue: Both domains need to work
**Solution:**
- Add both `lazyexcel.pro` and `easyexcel.in` to the redirect URLs list
- Set Site URL to your primary domain (`lazyexcel.pro`)

## Current Code Status

✅ **Frontend code is correct:**
- `AuthContext.tsx` uses `redirectTo: ${window.location.origin}` (dynamic)
- No hardcoded redirects in the code
- The issue is purely in Supabase configuration

## Quick Checklist

- [ ] Updated Site URL in Supabase to `https://www.lazyexcel.pro`
- [ ] Added `https://www.lazyexcel.pro` to Redirect URLs
- [ ] Added `https://lazyexcel.pro` to Redirect URLs (non-www)
- [ ] Added wildcard versions (`/*`) if needed
- [ ] Saved all changes in Supabase
- [ ] Cleared browser cache
- [ ] Tested login from `lazyexcel.pro`
- [ ] Verified no redirect to `easyexcel.in`
