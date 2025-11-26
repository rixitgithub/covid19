# Deployment Guide

## Git LFS Setup

This repository uses Git LFS (Large File Storage) for the model file (`app/model.h5`). Make sure Git LFS is installed and configured on your deployment platform.

### For Render.com

1. **Enable Git LFS in Render:**
   - Go to your service settings
   - Under "Build Command", ensure Git LFS is installed:
   ```bash
   git lfs install && git lfs pull && <your-build-command>
   ```

2. **Or use a build script:**
   Create a `render-build.sh` file:
   ```bash
   #!/bin/bash
   git lfs install
   git lfs pull
   # Your build commands here
   ```

### For Other Platforms

Most platforms require Git LFS to be installed. Check your platform's documentation for Git LFS support.

## Alternative: Download Model During Build

If your platform doesn't support Git LFS, you can download the model during deployment:

1. Host the model file separately (e.g., on S3, Google Cloud Storage, or a CDN)
2. Download it during the build process
3. Update `app/main.py` to download the model if it doesn't exist locally

Example script to add to your build process:
```bash
# Download model if not present
if [ ! -f "app/model.h5" ]; then
  echo "Downloading model..."
  curl -L -o app/model.h5 <your-model-url>
fi
```

## Environment Variables for Deployment

### Backend (Render/Heroku/Railway)

Set these environment variables in your platform's dashboard:

```env
ALLOWED_ORIGINS=https://your-frontend-domain.com
HOST=0.0.0.0
PORT=8000
```

### Frontend (Vercel/Netlify)

Set these environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Build Commands

### Backend

```bash
cd app
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm start
```

## Troubleshooting

### Git LFS Error: Object does not exist

If you see this error, the LFS object wasn't uploaded. Run:
```bash
git lfs push origin main --all
```

### Model File Not Found

Ensure:
1. Git LFS is installed: `git lfs install`
2. LFS objects are pulled: `git lfs pull`
3. The model file exists: `ls -lh app/model.h5`

