# Render Deployment Guide for CookGenie

## Prerequisites
- GitHub account with your cookgenie repository
- Render.com account (free): https://render.com

## Deployment Steps

### 1. Sign Up / Login to Render
1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 2. Create New Blueprint
1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository: `apoorvtripathi1999/cookgenie`
3. Render will automatically detect `render.yaml`

### 3. Configure Environment Variables
Before deploying, you need to set your Gemini API key:

1. In the Blueprint setup, find the **cookgenie-backend** service
2. Add the environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyDxCaCPqNazjuOOaUzAyvD8SbUERLKsMR8`

### 4. Deploy
1. Click **"Apply"** to start deployment
2. Wait 5-10 minutes for all services to build and deploy

### 5. Access Your Application
After deployment completes, you'll get URLs for:
- **Frontend**: `https://cookgenie-frontend.onrender.com`
- **Backend API**: `https://cookgenie-backend.onrender.com`

## Important Notes

### Free Tier Limitations
- ⏰ Services spin down after 15 minutes of inactivity
- 🐌 First request after sleep takes ~50 seconds (cold start)
- 💾 Database expires after 90 days (can create new one)
- 📊 750 hours/month total across all services

### Environment Variables
The `render.yaml` automatically configures:
- Database connection string
- Backend URL for frontend
- All necessary environment variables

### Updating Your Deployment
Render automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update application"
git push origin main
```

## Manual Deployment (Alternative)

If the Blueprint doesn't work, deploy manually:

### 1. Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Name: `cookgenie-db`
3. Database Name: `cookgenie_db`
4. User: `cookgenie`
5. Plan: **Free**
6. Click **"Create Database"**

### 2. Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Settings:
   - **Name**: `cookgenie-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: **Free**
4. Environment Variables:
   - `DATABASE_URL`: Copy from your PostgreSQL database (Internal Database URL)
   - `GEMINI_API_KEY`: `AIzaSyDxCaCPqNazjuOOaUzAyvD8SbUERLKsMR8`
   - `ENVIRONMENT`: `production`
5. Click **"Create Web Service"**

### 3. Deploy Frontend
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Settings:
   - **Name**: `cookgenie-frontend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: **Free**
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://cookgenie-backend.onrender.com`
5. Click **"Create Web Service"**

## Troubleshooting

### Backend Not Connecting to Database
- Check the `DATABASE_URL` environment variable
- Ensure it uses the **Internal Database URL** from Render
- Format: `postgresql://user:password@host/database`

### Frontend Can't Reach Backend
- Verify `NEXT_PUBLIC_API_URL` points to your backend URL
- Check backend health: `https://your-backend.onrender.com/health`

### Build Failures
- Check build logs in Render dashboard
- Ensure `Dockerfile` and `requirements.txt` are correct
- Verify all dependencies are listed in `package.json`

### Cold Starts (Slow Initial Load)
- This is normal for free tier
- Services sleep after 15 minutes of inactivity
- First request takes ~50 seconds to wake up
- Subsequent requests are fast

## Keeping Services Awake (Optional)

To prevent cold starts, use a service like:
- **UptimeRobot** (free): Ping your URLs every 5 minutes
- **Cron-job.org** (free): Schedule regular requests

⚠️ Note: Render may rate-limit excessive pings on free tier

## Cost Estimates

**Free Tier:**
- PostgreSQL: Free (90 days)
- Backend: Free (with sleep)
- Frontend: Free (with sleep)
- **Total: $0/month**

**Paid Tier (No Sleep):**
- PostgreSQL: $7/month
- Backend: $7/month
- Frontend: $7/month
- **Total: ~$21/month**

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Your GitHub Repo: https://github.com/apoorvtripathi1999/cookgenie
