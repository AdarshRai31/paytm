# Troubleshooting Deployment Issues

## Common Deployment Errors and Solutions

### 1. Service Failed to Start (Render/Railway)

#### Error: "Service failed to start"
**Possible Causes:**
- Missing environment variables
- MongoDB connection failure
- Port configuration issue
- Build command failing

**Solutions:**

1. **Check Environment Variables:**
   - Ensure all required env vars are set in Render/Railway dashboard:
     - `JWT_SECRET`
     - `MONGODB_URL`
     - `FRONTEND_URL` (optional for initial deploy)
     - `NODE_ENV=production`
     - `PORT` (usually auto-set by Render)

2. **Verify MongoDB Connection:**
   ```bash
   # Test your MongoDB URL locally
   # Make sure it includes the database name
   mongodb+srv://username:password@cluster.mongodb.net/paytm?retryWrites=true&w=majority
   ```

3. **Check Build Logs:**
   - Go to your service dashboard
   - Click on "Logs" tab
   - Look for error messages during build/start

4. **Common Fixes:**
   - Update build command to: `cd backend && npm install`
   - Update start command to: `cd backend && npm start`
   - Ensure root directory is set to `backend` (if deploying from monorepo)

### 2. MongoDB Connection Failed

#### Error: "MongoDB connection error" or "MONGODB_URL not defined"

**Solutions:**

1. **Check MongoDB Atlas:**
   - Network Access: Add `0.0.0.0/0` to allow all IPs
   - Database Access: Ensure user has read/write permissions
   - Connection String: Copy from "Connect" → "Connect your application"

2. **Verify Connection String Format:**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
   ```
   - Replace `<username>`, `<password>`, `<database>` with actual values
   - URL encode special characters in password (use `%40` for `@`, etc.)

3. **Test Connection:**
   ```bash
   # In your local backend directory
   node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URL).then(() => { console.log('Connected!'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });"
   ```

### 3. Build Command Failed

#### Error: "Build failed" or "npm install failed"

**Solutions:**

1. **Check Node Version:**
   - Render/Railway usually auto-detects, but you can specify in `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. **Clear Cache:**
   - In Render: Settings → Clear build cache → Redeploy
   - Or delete `package-lock.json` and reinstall

3. **Fix Build Command:**
   - If deploying from monorepo root:
     - Build: `cd backend && npm install`
     - Start: `cd backend && npm start`
   - Set Root Directory to `backend` in service settings

### 4. Port Already in Use

#### Error: "Port 3000 already in use" or "EADDRINUSE"

**Solution:**
- Render/Railway auto-assigns PORT
- Always use `process.env.PORT` in your code (already configured)
- Don't hardcode port numbers

### 5. CORS Errors

#### Error: "CORS policy" or "Access-Control-Allow-Origin"

**Solutions:**

1. **Update FRONTEND_URL:**
   - Set `FRONTEND_URL` in backend environment variables
   - Use your actual frontend deployment URL
   - Include protocol: `https://your-app.vercel.app`

2. **Allow Multiple Origins:**
   - Code already updated to handle multiple origins
   - In production, only your frontend URL will be allowed

### 6. Health Check Failed

#### Error: "Health check failed" (Render)

**Solutions:**

1. **Verify Health Endpoint:**
   - Should be accessible at: `https://your-service.onrender.com/health`
   - Should return: `{"status":"ok","database":"connected"}`

2. **Update Health Check Path:**
   - In Render: Settings → Health Check Path: `/health`
   - Or update in `render.yaml`

### 7. Environment Variables Not Loading

#### Error: "JWT_SECRET is undefined" or similar

**Solutions:**

1. **Verify in Dashboard:**
   - Go to Environment tab
   - Ensure all variables are set
   - Check for typos (case-sensitive)

2. **Restart Service:**
   - After adding env vars, restart the service
   - Changes take effect after restart

3. **Check .env file:**
   - Don't rely on .env file in production
   - Set all variables in platform dashboard

### 8. Frontend API Calls Failing

#### Error: "Network error" or "CORS error" from frontend

**Solutions:**

1. **Set VITE_API_BASE_URL:**
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   ```

2. **Redeploy Frontend:**
   - After setting env var, redeploy frontend
   - Vite requires rebuild to pick up env vars

3. **Verify Backend URL:**
   - Test backend health: `https://your-backend.onrender.com/health`
   - Should return JSON response

### 9. Render Free Tier Spinning Down

#### Service goes to sleep after inactivity

**Solutions:**

1. **Upgrade to Paid:**
   - $7/month for always-on service

2. **Use External Ping Service:**
   - Set up UptimeRobot or similar
   - Ping your `/health` endpoint every 5 minutes
   - Keeps free tier service awake

3. **Add Keep-Alive:**
   - Create a simple cron job
   - Or use a free monitoring service

### 10. Database Schema Errors

#### Error: "Schema validation failed" or "Model not found"

**Solutions:**

1. **Check Database Name:**
   - Ensure database name in connection string matches
   - MongoDB Atlas creates database on first write

2. **Verify Collections:**
   - Collections are created automatically
   - Check MongoDB Atlas dashboard for collections

### Quick Fixes Checklist

- [ ] All environment variables set in platform dashboard
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] MongoDB connection string is correct and URL-encoded
- [ ] Build command includes directory: `cd backend && npm install`
- [ ] Start command includes directory: `cd backend && npm start`
- [ ] Root directory set to `backend` (if deploying from monorepo)
- [ ] Health check path set to `/health`
- [ ] FRONTEND_URL matches actual frontend deployment URL
- [ ] VITE_API_BASE_URL set in frontend with correct backend URL
- [ ] Both services restarted after setting env vars

### Getting Help

1. **Check Logs:**
   - Render: Dashboard → Service → Logs
   - Railway: Dashboard → Service → Deployments → View Logs
   - Vercel: Dashboard → Project → Deployments → View Logs

2. **Test Locally:**
   - Reproduce issue locally with production env vars
   - Test MongoDB connection separately
   - Verify all dependencies install correctly

3. **Common Commands:**
   ```bash
   # Test backend locally with production env
   cd backend
   NODE_ENV=production node index.js
   
   # Test MongoDB connection
   node -e "require('mongoose').connect(process.env.MONGODB_URL).then(() => console.log('OK')).catch(e => console.error(e))"
   
   # Check environment variables
   node -e "require('dotenv').config(); console.log(process.env)"
   ```

### Service-Specific Issues

#### Render
- Free tier spins down after 15 min inactivity
- First deployment can take 5-10 minutes
- Check "Events" tab for deployment status

#### Railway
- Auto-detects Node.js projects
- Uses `package.json` scripts automatically
- Check "Deployments" tab for logs

#### Vercel
- Frontend builds are fast
- Environment variables require rebuild
- Check "Deployments" → "Functions" for API routes

#### Netlify
- Similar to Vercel for frontend
- Check "Deploys" tab for build logs
- Environment variables in "Site settings" → "Environment variables"

