# Deployment Guide

**Frontend → Vercel** | **Backend → Railway** | **Database → Supabase ✅ (already configured)**

---

## Architecture

```
Users
  │
  ├─► Vercel (Frontend)
  │     React 19 + Vite + Tailwind CSS v4
  │     https://your-app.vercel.app
  │
  └─► Railway (Backend)
        Node.js + Express + Prisma
        https://your-backend.railway.app
              │
              └─► Supabase (Database) ✅ DONE
                    PostgreSQL + pgvector (384 dimensions)
                    aws-0-ap-northeast-2 region
```

---

## Status Checklist

- [x] Database (Supabase) — already running, pgvector enabled
- [x] Code changes — API URL env variable, CORS, start script, vercel.json, railway.json
- [ ] Backend → Deploy on Railway
- [ ] Frontend → Deploy on Vercel
- [ ] Set `FRONTEND_URL` on Railway after Vercel URL is known

---

## Step 1: Push to GitHub

Make sure all changes are committed and pushed:

```bash
cd /path/to/ai-contract-management

git add .
git commit -m "chore: production deployment configuration"
git push origin main
```

> ⚠️ **Important**: Verify your root `.gitignore` excludes `.env` files but INCLUDES the `prisma/` directory so `schema.prisma` and `migrations/` are committed to Git. These are required for Railway's `prisma generate`.

---

## Step 2: Deploy Backend on Railway

### 2.1 Create a Railway Project
1. Go to [railway.app](https://railway.app) → Sign in with GitHub.
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your repository.
4. In the project settings, set **Root Directory** → `backend`.

### 2.2 Set Environment Variables on Railway
In your Railway project, click **Variables** and add each one:

| Variable |
> These exact values are in your local `backend/.env` file.

### 2.3 Trigger Deployment
Railway deploys automatically when env vars are saved. Watch the **Deployments** tab for build logs.

The `postinstall` script runs `prisma generate` automatically during `npm install`.

### 2.4 Copy Your Railway URL
After deployment succeeds, Railway gives you a public URL like:
```
https://ai-contract-management-production.railway.app
```
**Copy it** — you'll need it for Step 3.

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Import Project on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub.
2. Click **"Add New Project"** → select your repository.
3. Set **Root Directory** → `frontend`.
4. Vercel auto-detects Vite. Build settings will be:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.2 Set Environment Variable on Vercel
In **Environment Variables**, add:

| Variable | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://your-backend.railway.app/api` ← your Railway URL + `/api` |

### 3.3 Deploy
Click **Deploy**. Vercel builds and deploys in ~60 seconds.

Your app will be live at:
```
https://your-app-name.vercel.app
```

---

## Step 4: Wire CORS on Railway

Now that you have your Vercel URL, go back to Railway → **Variables** and set:

| Variable | Value |
| :--- | :--- |
| `FRONTEND_URL` | `https://your-app-name.vercel.app` |

Railway redeploys automatically. Your backend now accepts requests from the production frontend.

---

## Step 5: Verify Production

Test these flows end-to-end on your live URL:

- [ ] `/` — Landing page loads
- [ ] `/register` — Register a new account
- [ ] `/login` — Login returns a JWT and redirects to dashboard
- [ ] `/dashboard` — Dashboard loads (empty state is fine)
- [ ] Upload a PDF → chunks created + vectorized in Supabase
- [ ] Trigger AI analysis → summary and risks rendered
- [ ] Ask question in AI panel → RAG answer returned
- [ ] Set a reminder → shows in Reminders page

---

## Common Issues

### CORS Error in Browser Console
- `FRONTEND_URL` on Railway must exactly match your Vercel URL with **no trailing slash**.
- ✅ `https://ai-contract-management.vercel.app`
- ❌ `https://ai-contract-management.vercel.app/`

### React Router "Page Not Found" on Refresh
- Fixed by `frontend/vercel.json` which routes all paths to `index.html`.

### `prisma generate` fails on Railway
- Ensure the `prisma/` directory is NOT in your `.gitignore` (it was — now fixed).
- Railway needs `prisma/schema.prisma` to generate the client.

### FastEmbed ONNX Model Download
- On first contract upload, Railway downloads the ~67MB ONNX embedding model to `/tmp`.
- Railway containers have a persistent `/tmp` within a deployment — subsequent uploads are fast.
- If the model download times out, retry the upload once.

### `DIRECT_URL` vs `DATABASE_URL`
- `DATABASE_URL` uses port `6543` (transaction pooler) — used by the running app.
- `DIRECT_URL` uses port `5432` (session pooler) — used by Prisma migrations.
- Both are already configured in Supabase.

---

## Summary of Code Changes Made

| File | Change |
| :--- | :--- |
| `frontend/src/api/api.js` | Uses `VITE_API_URL` env variable (falls back to localhost) |
| `frontend/vercel.json` | SPA routing fallback for React Router |
| `frontend/.env.example` | Documents `VITE_API_URL` |
| `backend/src/app.js` | CORS reads `FRONTEND_URL` env variable |
| `backend/package.json` | Fixed `start` script: `node src/server.js` |
| `backend/railway.json` | Railway deployment config |
| `backend/.env` | Removed duplicate local `DATABASE_URL` |
| `backend/.gitignore` | Fixed: `prisma/` no longer ignored so schema is committed |
| `backend/.env.example` | Documents all required env variables |
| `backend/prisma/schema.prisma` | Added `directUrl` for Supabase dual-URL support |
