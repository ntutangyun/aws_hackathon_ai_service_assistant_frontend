# Frontend Deployment Configuration

## 🌐 Dynamic API Endpoint Configuration

The frontend automatically detects the deployment environment and uses the appropriate backend API URL.

### How It Works

The application uses the `src/config/api.js` file to dynamically determine the backend API URL based on the current hostname:

```javascript
// Automatic detection:
if (hostname === 'localhost' || hostname === '127.0.0.1') {
  → http://localhost:8000
}
else if (hostname.includes('amplifyapp.com')) {
  → https://wdmniyiwug.us-east-1.awsapprunner.com
}
```

### Deployment Scenarios

#### 1️⃣ **Local Development**
- **URL**: `http://localhost:5173` (Vite dev server)
- **Backend**: `http://localhost:8000`
- **Action**: No configuration needed! ✅

```bash
cd frontend
npm run dev
# Backend automatically points to localhost:8000
```

#### 2️⃣ **AWS Amplify Deployment**
- **URL**: `https://main.d1234abcd.amplifyapp.com` (or your custom domain)
- **Backend**: `https://wdmniyiwug.us-east-1.awsapprunner.com`
- **Action**: No configuration needed! ✅

The app automatically detects `amplifyapp.com` in the URL and switches to production backend.

#### 3️⃣ **Custom Domain on Amplify**
If you add a custom domain to Amplify, update `src/config/api.js`:

```javascript
// Add this check in getApiUrl()
if (hostname.includes('yourdomain.com')) {
  return 'https://wdmniyiwug.us-east-1.awsapprunner.com';
}
```

#### 4️⃣ **Manual Override (Optional)**
You can override auto-detection using environment variables:

Create `.env.local`:
```env
VITE_API_URL=https://custom-backend-url.com
```

This will override all auto-detection logic.

---

## 🔧 Configuration Files

### `src/config/api.js`
Main configuration file that handles API URL detection.

### `.env.example`
Template for environment variables (optional).

### `.env.local` (gitignored)
Local development overrides (optional).

---

## 🚀 Deployment Steps

### For AWS Amplify

#### Option 1: Console Deployment (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Add dynamic API configuration"
git push
```

2. **Deploy via Amplify Console**:
   - Go to: https://console.aws.amazon.com/amplify/
   - Select your app
   - Amplify auto-deploys from Git
   - **No environment variables needed!** ✅

3. **Verify**:
   - Open browser console on deployed site
   - Check for: `🌐 API Endpoint: https://wdmniyiwug.us-east-1.awsapprunner.com`

#### Option 2: Amplify CLI

```bash
cd frontend
amplify publish
```

---

## 🐛 Debugging

### Check Current Configuration

Open browser console (F12) and look for:
```
🌐 API Endpoint: http://localhost:8000
📍 Current Host: localhost
```

or

```
🌐 API Endpoint: https://wdmniyiwug.us-east-1.awsapprunner.com
📍 Current Host: main.d1234abcd.amplifyapp.com
```

### Common Issues

#### Issue: "API still pointing to localhost on Amplify"
**Solution**:
- Clear browser cache
- Check browser console for correct URL
- Verify deployment completed successfully

#### Issue: "CORS errors on production"
**Solution**:
Backend needs to allow Amplify URL in CORS:

```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local dev
        "https://*.amplifyapp.com",  # Amplify
        "https://yourdomain.com"  # Custom domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Issue: "Need different backend for staging"
**Solution**:
Update `src/config/api.js`:

```javascript
// Check for staging branch
if (hostname.includes('staging') && hostname.includes('amplifyapp.com')) {
  return 'https://staging-backend-url.com';
}
```

---

## 📝 Environment Variables Reference

### Vite Environment Variables

Vite exposes env variables that start with `VITE_`:

- **`VITE_API_URL`** (optional): Override API URL detection
- Access in code: `import.meta.env.VITE_API_URL`

### Setting in Amplify Console

If needed, you can set environment variables in Amplify:

1. Go to Amplify Console → Your App
2. Click **Environment variables** in left menu
3. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://wdmniyiwug.us-east-1.awsapprunner.com`

**Note**: This is **not required** with automatic detection! Only use if you need to override.

---

## 🔒 Security Notes

1. ✅ **API URL is not sensitive** - It's visible in browser anyway
2. ✅ **No API keys in frontend** - All authentication should be on backend
3. ✅ **CORS properly configured** - Backend should validate origins
4. ✅ **HTTPS in production** - Both Amplify and App Runner provide SSL

---

## 📊 Testing Checklist

### Local Development
- [ ] Run `npm run dev`
- [ ] Check console shows `http://localhost:8000`
- [ ] API calls work correctly
- [ ] Chat functionality works

### Production (Amplify)
- [ ] Deploy to Amplify
- [ ] Open deployed URL
- [ ] Check console shows `https://wdmniyiwug.us-east-1.awsapprunner.com`
- [ ] API calls work correctly
- [ ] No CORS errors
- [ ] Chat functionality works
- [ ] Debug panel loads data

---

## 🆕 Future Enhancements

### Multiple Environments

If you need staging/production environments:

```javascript
// src/config/api.js
const getApiUrl = () => {
  const hostname = window.location.hostname;

  // Local development
  if (hostname === 'localhost') {
    return 'http://localhost:8000';
  }

  // Staging environment
  if (hostname.includes('staging.amplifyapp.com')) {
    return 'https://staging-api.awsapprunner.com';
  }

  // Production environment
  if (hostname.includes('amplifyapp.com') || hostname.includes('yourdomain.com')) {
    return 'https://wdmniyiwug.us-east-1.awsapprunner.com';
  }

  return 'http://localhost:8000';
};
```

### Feature Flags

Add feature detection:

```javascript
export const config = {
  API_URL: getApiUrl(),
  isDevelopment: hostname === 'localhost',
  isProduction: hostname.includes('amplifyapp.com'),
  features: {
    debugMode: hostname === 'localhost',
    analytics: hostname.includes('amplifyapp.com')
  }
};
```

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [AWS Amplify Hosting](https://docs.amplify.aws/hosting/)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## ✅ Summary

**No configuration needed!** 🎉

The app automatically:
- Uses `localhost:8000` during development
- Uses `https://wdmniyiwug.us-east-1.awsapprunner.com` on Amplify
- Logs the current configuration to browser console

Just code, commit, and deploy!
