# 🚀 Deployment Guide: Render (Backend) + Vercel (Frontend)

This guide provides step-by-step instructions to deploy **API Sentinel** using **Render** for the Express/Node.js Backend and **Vercel** for the React/Vite Frontend.

---

## 🛠️ Step 1: Push Code to GitHub

1. Open your terminal in the root of the project.
2. Initialize git and commit your changes:
   ```bash
   git init
   git add .
   git commit -m "Configure production deployment for Render and Vercel"
   git branch -M main
   ```
3. Create a repository on [GitHub](https://github.com/new) named `api-sentinel`.
4. Link and push to your repository:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/api-sentinel.git
   git push -u origin main
   ```

---

## 🖥️ Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and log in.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`api-sentinel`).
4. Configure the Web Service settings:
   - **Name**: `api-sentinel-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma db push && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start
     ```
   - **Instance Type**: Free

5. Expand **Environment Variables** and add:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `api_sentinel_jwt_secret_key_2026_prod`
   - `JWT_REFRESH_SECRET` = `api_sentinel_refresh_secret_key_2026_prod`
   - `DATABASE_URL` = `file:./dev.db` *(or PostgreSQL URL if using hosted DB)*
   - `FRONTEND_URL` = `https://<YOUR-VERCEL-APP-NAME>.vercel.app` *(Optional: set after deploying Vercel)*

6. Click **Create Web Service**.
7. Once deployed, Render will provide your backend URL:
   `https://api-sentinel-backend.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and log in.
2. Click **Add New...** -> **Project**.
3. Import your `api-sentinel` GitHub repository.
4. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   *(If you select `frontend` as Root Directory in Vercel settings, set Build Command to `npm run build` and Output Directory to `dist`)*

5. Expand **Environment Variables** and add:
   - `VITE_API_URL` = `https://api-sentinel-backend.onrender.com` *(Replace with your Render backend URL)*

6. Click **Deploy**.
7. Vercel will build and assign a free HTTPS URL (e.g., `https://api-sentinel.vercel.app`).

---

## ✅ Step 4: Verify Deployment

1. Open your Vercel URL in any browser or mobile device.
2. Try registering a new user or logging in with default credentials:
   - **Email**: `admin@sentinel.dev`
   - **Password**: `admin123`
3. Check the WebSocket status indicator in the top navbar to verify real-time monitoring events.

---

## ⚙️ Summary of Key Environment Variables

| Variable | Location | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Vercel | Backend URL for REST API & WebSockets | `https://api-sentinel-backend.onrender.com` |
| `JWT_SECRET` | Render | Secret key for JWT auth tokens | `super_secret_jwt_key` |
| `JWT_REFRESH_SECRET` | Render | Secret key for refresh tokens | `super_secret_refresh_key` |
| `DATABASE_URL` | Render | SQLite or PostgreSQL connection string | `file:./dev.db` |
| `FRONTEND_URL` | Render | Vercel domain for CORS policy | `https://api-sentinel.vercel.app` |
