# AWS Frontend Deployment Guide

## 🚀 Option 1: AWS Amplify (Recommended - Easiest)

### Prerequisites
- AWS Account
- Git repository (GitHub, GitLab, or Bitbucket)
- Code pushed to your repository

### Method A: Deploy via AWS Console (No CLI needed)

#### Step 1: Push Your Code to Git
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub (create repo first on GitHub)
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy via AWS Amplify Console

1. **Go to AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. Click **"New app"** → **"Host web app"**
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize AWS Amplify to access your repository
5. Select your repository and branch (e.g., `main`)
6. Configure build settings:

**Build Settings (Auto-detected for Vite):**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

7. **Add Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-api-url.com`

8. Click **"Save and deploy"**

#### Step 3: Wait for Deployment
- Amplify will automatically build and deploy
- You'll get a URL like: `https://main.d1234abcd.amplifyapp.com`

#### Step 4: Custom Domain (Optional)
1. In Amplify Console → **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

### Method B: Deploy via Amplify CLI

#### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### Step 2: Initialize Amplify in Your Project
```bash
cd frontend
amplify init
```

Answer the prompts:
```
? Enter a name for the project: ai-service-assistant
? Enter a name for the environment: prod
? Choose your default editor: Visual Studio Code
? Choose the type of app: javascript
? What javascript framework: react
? Source Directory Path: src
? Distribution Directory Path: dist
? Build Command: npm run build
? Start Command: npm run dev
```

#### Step 3: Add Hosting
```bash
amplify add hosting
```

Select:
```
? Select the plugin module to execute: Hosting with Amplify Console
? Choose a type: Manual deployment
```

#### Step 4: Deploy
```bash
amplify publish
```

---

## 🥈 Option 2: AWS S3 + CloudFront (More Control)

### Step 1: Build Your Application
```bash
cd frontend
npm run build
# This creates a 'dist' folder
```

### Step 2: Create S3 Bucket

**Via AWS Console:**
1. Go to S3 Console: https://s3.console.aws.amazon.com/
2. Click **"Create bucket"**
3. Bucket name: `your-app-name-frontend` (must be globally unique)
4. Region: Choose your preferred region
5. **Uncheck** "Block all public access"
6. Click **"Create bucket"**

**Via AWS CLI:**
```bash
aws s3 mb s3://your-app-name-frontend --region us-east-1
```

### Step 3: Configure S3 for Static Website Hosting

**Via Console:**
1. Go to your bucket → **"Properties"**
2. Scroll to **"Static website hosting"**
3. Click **"Edit"**
4. Enable static website hosting
5. Index document: `index.html`
6. Error document: `index.html` (for SPA routing)
7. Save changes

**Via AWS CLI:**
```bash
aws s3 website s3://your-app-name-frontend/ \
  --index-document index.html \
  --error-document index.html
```

### Step 4: Set Bucket Policy (Make Public)

Create file `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-app-name-frontend/*"
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy \
  --bucket your-app-name-frontend \
  --policy file://bucket-policy.json
```

### Step 5: Upload Your Build Files

```bash
aws s3 sync dist/ s3://your-app-name-frontend/ --delete
```

Your site is now available at:
`http://your-app-name-frontend.s3-website-us-east-1.amazonaws.com`

### Step 6: Add CloudFront (CDN + HTTPS)

**Via Console:**
1. Go to CloudFront Console: https://console.aws.amazon.com/cloudfront/
2. Click **"Create distribution"**
3. **Origin domain**: Select your S3 bucket website endpoint
   - Use the website endpoint, NOT the bucket endpoint
   - Format: `your-bucket-name.s3-website-us-east-1.amazonaws.com`
4. **Viewer protocol policy**: Redirect HTTP to HTTPS
5. **Cache policy**: CachingOptimized
6. **Default root object**: `index.html`
7. **Custom error responses** (for SPA routing):
   - Error code: 403
   - Response page path: `/index.html`
   - HTTP response code: 200
   - Error code: 404
   - Response page path: `/index.html`
   - HTTP response code: 200
8. Click **"Create distribution"**

Wait 5-15 minutes for deployment. You'll get a CloudFront URL like:
`https://d1234abcd.cloudfront.net`

### Step 7: Custom Domain with Route 53 (Optional)

1. Request SSL certificate in ACM (us-east-1 for CloudFront)
2. Add alternate domain name (CNAME) in CloudFront
3. Create Route 53 A record pointing to CloudFront

---

## 🥉 Option 3: AWS App Runner (Container-based)

If you want to containerize your frontend:

### Step 1: Create Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf

```nginx
# frontend/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

### Step 3: Deploy to AWS App Runner

1. Push Docker image to ECR or use GitHub
2. Go to App Runner Console
3. Create service from container image or GitHub
4. Configure port 80
5. Deploy

---

## 📋 Quick Comparison

| Feature | Amplify | S3 + CloudFront | App Runner |
|---------|---------|-----------------|------------|
| **Setup Time** | 5-10 min | 15-30 min | 20-40 min |
| **Difficulty** | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Complex |
| **CI/CD** | Built-in ✅ | Manual | Built-in ✅ |
| **SSL/HTTPS** | Auto ✅ | Via CloudFront | Via Load Balancer |
| **Custom Domain** | Easy ✅ | Via Route 53 | Via Route 53 |
| **Cost** | Free tier: 1000 build min/month | ~$1-5/month | ~$5-10/month |
| **Best For** | Quick deployment, CI/CD | Full control, custom config | Containerized apps |

---

## 💰 Estimated Costs

### AWS Amplify
- **Free Tier**: 1000 build minutes/month, 15 GB served/month
- **After Free Tier**:
  - Build: $0.01/min
  - Hosting: $0.15/GB served
  - **Typical**: $0-5/month for small apps

### S3 + CloudFront
- **S3 Storage**: $0.023/GB/month
- **S3 Requests**: $0.0004/1000 GET requests
- **CloudFront**: $0.085/GB for first 10TB
- **Typical**: $1-5/month for small apps

### App Runner
- **Compute**: $0.007/vCPU-hour + $0.0008/GB-memory-hour
- **Typical**: $5-10/month minimum

---

## 🎯 Recommendation

**For your use case, I recommend AWS Amplify** because:

1. ✅ **Fastest setup** - Deploy in under 10 minutes
2. ✅ **Built-in CI/CD** - Auto-deploy on git push
3. ✅ **Free tier** - Perfect for development/testing
4. ✅ **AWS integration** - Works seamlessly with your AWS backend
5. ✅ **Preview deployments** - Test branches before merging
6. ✅ **Environment variables** - Easy backend URL configuration
7. ✅ **Auto SSL** - Free HTTPS certificates
8. ✅ **Zero maintenance** - Fully managed service

---

## 🚀 Deployment Scripts

### For AWS Amplify CLI

Create `frontend/amplify-deploy.sh`:
```bash
#!/bin/bash
echo "Building and deploying to AWS Amplify..."
amplify publish --yes
```

### For S3 + CloudFront

Create `frontend/deploy-s3.sh`:
```bash
#!/bin/bash
echo "Building application..."
npm run build

echo "Syncing to S3..."
aws s3 sync dist/ s3://your-app-name-frontend/ --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

Make executable:
```bash
chmod +x deploy-s3.sh
./deploy-s3.sh
```

---

## 🔧 Environment Variables

### For Production Deployment

Create `.env.production`:
```env
VITE_API_URL=https://your-production-api.com
```

### For Staging Deployment

Create `.env.staging`:
```env
VITE_API_URL=https://your-staging-api.com
```

Build for specific environment:
```bash
npm run build -- --mode production
# or
npm run build -- --mode staging
```

---

## 📝 Post-Deployment Checklist

- [ ] Verify frontend loads correctly
- [ ] Test API connectivity (backend URL configured)
- [ ] Check all routes work (SPA routing)
- [ ] Verify HTTPS/SSL certificate
- [ ] Test mobile responsiveness
- [ ] Check browser console for errors
- [ ] Test all API endpoints through UI
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics (optional)
- [ ] Create deployment documentation

---

## 🆘 Troubleshooting

### Issue: 404 on routes
**Solution**: Configure error document to redirect to index.html

### Issue: API calls failing
**Solution**: Check VITE_API_URL environment variable and CORS settings

### Issue: Build fails
**Solution**: Check Node version compatibility (use Node 18+)

### Issue: Slow initial load
**Solution**: Enable CloudFront caching and gzip compression

---

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
