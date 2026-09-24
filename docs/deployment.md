# Deployment & Multi-Device Access Guide

## Option 1: Access on Any Mobile or Laptop on your Local Wi-Fi Network

You can immediately open API Sentinel on any phone, tablet, or laptop connected to the same Wi-Fi network without deploying to the internet:

1. **Find your PC's Local IP Address**:
   - Open Command Prompt or PowerShell and type: `ipconfig`
   - Look for IPv4 Address (e.g. `192.168.1.15`).
2. **Start Dev Servers with Host Binding**:
   ```bash
   npm run dev -- --host
   ```
3. **Open on any Mobile or Laptop**:
   - Open browser on mobile/laptop: `http://192.168.1.15:5173`

---

## Option 2: Deploy to Vercel (Free Public URL)

API Sentinel is 100% prepared for **Vercel Deployment** with `vercel.json` included at the root!

### Step 1: Push Code to GitHub
1. Create a repository on [GitHub](https://github.com/new) named `api-sentinel`.
2. Push your project code:
   ```bash
   git init
   git add .
   git commit -m "Deploy API Sentinel to Vercel"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/api-sentinel.git
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your `api-sentinel` GitHub repository.
3. In **Environment Variables**, add:
   - `JWT_SECRET` = `api_sentinel_super_secret_jwt_key_2026`
   - `JWT_REFRESH_SECRET` = `api_sentinel_refresh_secret_key_2026`
   - `DATABASE_URL` = `file:./dev.db` (or a free Supabase / Neon / Render PostgreSQL connection string)
4. Click **Deploy**!

Vercel will give you a free HTTPS URL (e.g. `https://api-sentinel.vercel.app`) that can be opened from **ANY mobile phone, laptop, or tablet in the world!**
