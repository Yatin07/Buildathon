# UrbanVoice Admin Portal - Deployment Guide

## Prerequisites
- GitHub account
- Netlify account (free tier works)
- Firebase project credentials

## Step 1: Push to GitHub

```bash
cd C:\HACK\admin_portal
git init
git add .
git commit -m "Initial commit - UrbanVoice Admin Portal"
git remote add origin https://github.com/Yatin07/Buildathon.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Netlify

### Option A: Netlify CLI (Recommended)
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option B: Netlify Dashboard
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - Base directory: `admin_portal`
   - Build command: `npm run build`
   - Publish directory: `admin_portal/dist`
5. Click "Deploy site"

## Step 3: Configure Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Redeploy

After adding environment variables, trigger a new deployment:
- Netlify Dashboard → Deploys → Trigger deploy → Deploy site

## Troubleshooting

### Build fails
- Check that all dependencies are in package.json
- Ensure Node version is compatible (v18+)

### Firebase connection fails
- Verify environment variables are set correctly
- Check Firebase security rules

### Routes not working
- Ensure netlify.toml has the redirect rule
- Check that publish directory is correct

## Your Deployment URL
After deployment, Netlify will provide a URL like:
`https://your-site-name.netlify.app`

You can customize this in Site settings → Domain management
