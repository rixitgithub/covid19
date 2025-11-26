# Render.com Deployment Setup

## Quick Setup Guide

### Option 1: Using render.yaml (Recommended)

1. The repository includes a `render.yaml` file for automatic service configuration
2. In Render dashboard:
   - Go to "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect and create services from `render.yaml`

### Option 2: Manual Setup

1. **Create a new Web Service** in Render
2. **Connect your GitHub repository**: `https://github.com/rixitgithub/covid19`
3. **Configure the service:**
   - **Name**: `covid19-backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.` (root directory)
   - **Service Root Directory**: Leave empty (or set to `.`)
   - **Build Command**: (Not needed for Docker)
   - **Start Command**: (Handled by Dockerfile)

4. **Environment Variables:**
   Add these in Render dashboard:
   ```
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   HOST=0.0.0.0
   PORT=8000
   ```

5. **Important for Git LFS:**
   - Render should automatically handle Git LFS during clone
   - If you encounter LFS issues, the Dockerfile includes Git LFS installation

## Troubleshooting

### Error: Service Root Directory missing

**Solution**: Leave "Service Root Directory" empty in Render settings, or set it to `.` (root)

### Error: Git LFS object not found

The Dockerfile installs Git LFS, but if issues persist:
1. Ensure Git LFS is enabled in your Render account
2. Check that the model file was properly pushed: `git lfs push origin main --all`

### Error: Model file not found

The model file should be automatically pulled during the Docker build. If it's missing:
1. Verify Git LFS is working: `git lfs ls-files`
2. Check the build logs in Render for LFS pull messages

## Build Process

The Dockerfile will:
1. Install Git and Git LFS
2. Copy application files (including model.h5 via Git LFS)
3. Install Python dependencies
4. Start the FastAPI server

## After Deployment

1. Get your backend URL (e.g., `https://covid19-backend.onrender.com`)
2. Update your frontend's `NEXT_PUBLIC_API_URL` environment variable
3. Update backend's `ALLOWED_ORIGINS` to include your frontend URL
