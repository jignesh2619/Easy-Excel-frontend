# How to Change Vercel Deployment Domain to lazyexcel.pro

## Current Status
✅ **Environment Variables are correct:**
- `VITE_API_URL` = `https://api.lazyexcel.pro` ✓

## Steps to Change Deployment Domain

### Option 1: Add lazyexcel.pro as Primary Domain (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project (likely "Easy-Excel-frontend" or similar)

2. **Navigate to Domains:**
   - Click on **"Domains"** in the left sidebar (you can see it in your screenshot)

3. **Add New Domain:**
   - Click **"Add"** or **"Add Domain"** button
   - Enter: `lazyexcel.pro`
   - Click **"Add"**

4. **Configure DNS:**
   - Vercel will show you DNS records to add
   - You need to add these records to your domain registrar (where you bought lazyexcel.pro)
   - Typically you'll need to add:
     - **A Record** pointing to Vercel's IP
     - **CNAME Record** pointing to `cname.vercel-dns.com`
     - Or use **Nameservers** that Vercel provides

5. **Set as Primary Domain (Optional):**
   - Once the domain is verified, you can set it as the primary domain
   - This makes it the default domain for deployments

### Option 2: Remove easyexcel.in and Keep Only lazyexcel.pro

1. **Go to Domains section** (same as above)

2. **Remove easyexcel.in:**
   - Find `easyexcel.in` in the domains list
   - Click the three-dot menu (⋯) next to it
   - Select **"Remove"** or **"Delete"**
   - Confirm the removal

3. **Add lazyexcel.pro:**
   - Follow steps 3-4 from Option 1 above

### Option 3: Keep Both Domains

- You can keep both `easyexcel.in` and `lazyexcel.pro` active
- Both will point to the same deployment
- Users can access the site from either domain

## Important Notes

1. **DNS Propagation:**
   - After adding DNS records, it can take 24-48 hours for changes to propagate
   - Vercel will show domain status (Pending, Valid, Invalid)

2. **SSL Certificate:**
   - Vercel automatically provisions SSL certificates for your domains
   - This happens automatically once DNS is configured correctly

3. **Environment Variables:**
   - ✅ Already correct: `VITE_API_URL = https://api.lazyexcel.pro`
   - No changes needed here

4. **Automatic Deployments:**
   - Once the domain is configured, all future deployments will be available on `lazyexcel.pro`
   - The domain will automatically update with each new deployment

## Verification

After setting up the domain:

1. **Check Domain Status:**
   - Go to Vercel Dashboard → Your Project → Domains
   - Status should show "Valid" (green checkmark)

2. **Test the Domain:**
   - Visit: `https://lazyexcel.pro`
   - Should load your frontend application

3. **Check API Connection:**
   - Open browser console (F12)
   - Verify no CORS errors
   - API calls should go to `https://api.lazyexcel.pro`

## Current Configuration Summary

✅ **Environment Variables (Already Set):**
- `VITE_API_URL` = `https://api.lazyexcel.pro`
- `VITE_SUPABASE_URL` = (your Supabase URL)
- `VITE_SUPABASE_ANON_KEY` = (your Supabase key)

⏳ **Domain Configuration (Needs Update):**
- Currently deploying to: `easyexcel.in` (or default Vercel domain)
- Target domain: `lazyexcel.pro`
- Action needed: Add `lazyexcel.pro` in Vercel Domains section
