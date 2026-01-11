# 🔐 Environment Variables Setup Guide

## ✅ .env File Created!

I've created a `.env` file at:
`C:\HACK\admin_portal\admin_portal\.env`

## 📝 Current Configuration

The `.env` file contains your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=sih-2025-83f30.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sih-2025-83f30
VITE_FIREBASE_STORAGE_BUCKET=sih-2025-83f30.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=321192723603
VITE_FIREBASE_APP_ID=1:321192723603:web:7b0596c36866efbd8fb966
```

## ⚠️ IMPORTANT: Update API Key

The `VITE_FIREBASE_API_KEY` currently has placeholder "XXX" values. You need to replace it with your actual Firebase API key.

### How to Get Your Real API Key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **sih-2025-83f30**
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to **Your apps** section
5. Find your web app
6. Copy the **apiKey** value
7. Replace the XXX value in `.env` file

## 🚀 For Netlify Deployment

When deploying to Netlify, you need to add these same variables in the Netlify dashboard:

### Method 1: Using .env File (Recommended)

Netlify can read from your `.env` file automatically if you:
1. Commit `.env` to your repository (NOT recommended for production)
2. OR manually add each variable in Netlify dashboard (recommended)

### Method 2: Netlify Dashboard (Secure)

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add each variable one by one:

```
Key: VITE_FIREBASE_API_KEY
Value: <your-actual-api-key>

Key: VITE_FIREBASE_AUTH_DOMAIN
Value: sih-2025-83f30.firebaseapp.com

Key: VITE_FIREBASE_PROJECT_ID
Value: sih-2025-83f30

Key: VITE_FIREBASE_STORAGE_BUCKET
Value: sih-2025-83f30.firebasestorage.app

Key: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 321192723603

Key: VITE_FIREBASE_APP_ID
Value: 1:321192723603:web:7b0596c36866efbd8fb966
```

## 🔒 Security Note

The `.env` file is already in `.gitignore`, so it won't be committed to GitHub. This is good for security!

For Netlify deployment, you'll need to add these variables manually in the Netlify dashboard.

## ✅ Next Steps

1. **Update API Key** in `.env` file with your real Firebase API key
2. **Test locally**: Run `npm run dev` to ensure it works
3. **Deploy to Netlify**: Add the same variables in Netlify dashboard
4. **Verify**: Check that your deployed site connects to Firebase

## 🧪 Testing

After updating the API key, test that it works:

```bash
cd C:\HACK\admin_portal\admin_portal
npm run dev
```

Open http://localhost:5173 and try to login. If it works, your environment variables are correct!
