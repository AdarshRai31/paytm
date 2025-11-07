# Deployment Guide

This guide will help you deploy the PayTM application to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (already set up)
- Render account (for backend) - Free tier available
- Vercel account (for frontend) - Free tier available

## Step 1: Deploy Backend to Render

### Option A: Deploy via Render Dashboard

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up with your GitHub account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `paytm` repository

3. **Configure the Service**
   - **Name**: `paytm-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

4. **Set Environment Variables**
   Click "Advanced" and add these environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-secret-key-here-change-this-to-a-random-string
   MONGODB_URL=your-mongodb-connection-string
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://paytm-backend.onrender.com`)

### Option B: Deploy via Render CLI (Alternative)

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy
render deploy
```

## Step 2: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `paytm` repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   Add this environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
   ```
   Replace `your-backend-url` with your Render backend URL.

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend-url.onrender.com/api/v1

# Deploy to production
vercel --prod
```

## Step 3: Update Backend CORS

After deploying the frontend, update the backend's `FRONTEND_URL` environment variable on Render:

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel frontend URL
5. Restart the service

## Step 4: Update Frontend API URL

After deploying the backend, update the frontend's `VITE_API_BASE_URL` environment variable on Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update `VITE_API_BASE_URL` to your Render backend URL with `/api/v1`
5. Redeploy the project

## Alternative: Deploy to Railway

### Backend on Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Create a new project
4. Add a new service → "GitHub Repo"
5. Select your repository
6. Set root directory to `backend`
7. Add environment variables:
   - `JWT_SECRET`
   - `MONGODB_URL`
   - `PORT` (auto-set)
   - `FRONTEND_URL`
8. Railway will auto-deploy

### Frontend on Railway

1. Add another service to the same project
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_BASE_URL`
4. Railway will auto-deploy

## Alternative: Deploy to Netlify

### Frontend on Netlify

1. Go to https://netlify.com
2. Sign up with GitHub
3. Add new site → Import from Git
4. Select repository
5. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. Add environment variable:
   - `VITE_API_BASE_URL`
7. Deploy

## Environment Variables Summary

### Backend (Render/Railway)
```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-strong-secret-key-here
MONGODB_URL=your-mongodb-atlas-connection-string
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel/Netlify)
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
```

## Testing Deployment

1. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"ok"}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Try signing up and logging in
   - Test all features

## Troubleshooting

### Backend Issues

1. **Connection to MongoDB fails**
   - Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
   - Verify MONGODB_URL is correct
   - Check MongoDB Atlas database user permissions

2. **CORS errors**
   - Verify FRONTEND_URL is set correctly
   - Check backend CORS configuration

3. **Port issues**
   - Render auto-assigns PORT, use `process.env.PORT` in code
   - Already configured in `config.js`

### Frontend Issues

1. **API calls failing**
   - Verify VITE_API_BASE_URL is correct
   - Check browser console for errors
   - Ensure backend is accessible

2. **Build errors**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check build logs

## Cost Estimation

### Free Tier
- **Render**: Free tier available (spins down after inactivity)
- **Vercel**: Free tier with generous limits
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month for small projects

### Paid Options
- **Render**: $7/month for always-on service
- **Vercel**: Free tier is usually sufficient
- **MongoDB Atlas**: Pay as you go for larger databases

## Monitoring

1. **Backend Logs**: Check Render dashboard → Logs
2. **Frontend Logs**: Check Vercel dashboard → Deployments → Logs
3. **Error Tracking**: Consider adding Sentry for production

## Security Checklist

- [ ] Use strong JWT_SECRET (random string, 32+ characters)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables not exposed in code
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] CORS configured correctly
- [ ] Rate limiting considered (add if needed)

## Next Steps

1. Set up custom domains (optional)
2. Configure CI/CD (automatic with GitHub integration)
3. Add monitoring and error tracking
4. Set up database backups
5. Consider adding rate limiting
6. Add API documentation

