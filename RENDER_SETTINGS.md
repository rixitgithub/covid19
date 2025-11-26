# Render.com Settings Configuration

## Correct Settings for Backend Service

Use these exact settings in your Render dashboard:

### Service Configuration

- **Name**: `covid19-backend` (or any name you prefer)
- **Environment**: `Docker`

### Build & Deploy Settings

**Option 1: Using app directory (Recommended for your current setup)**

- **Root Directory**: `./app`
- **Dockerfile Path**: `./Dockerfile` (or just `Dockerfile`)
- **Docker Build Context Directory**: `.` (dot - current directory which is `app/`)
- **Docker Command**: Leave **EMPTY** (the Dockerfile CMD handles this)

**Option 2: Using root directory**

- **Root Directory**: `.` (dot - means root of repository) OR leave **EMPTY**
- **Dockerfile Path**: `./Dockerfile`
- **Docker Build Context Directory**: `.` (dot - root of repository)
- **Docker Command**: Leave **EMPTY** (the Dockerfile CMD handles this)

### Environment Variables

Add these in the "Environment" section:

```
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
HOST=0.0.0.0
PORT=8000
```

## Why These Settings?

- **Root Directory = `.`**: The Dockerfile is in the root, and it references `./app` directory
- **Dockerfile Path = `./Dockerfile`**: Points to the Dockerfile in the root directory
- **Docker Build Context = `.`**: Docker needs the root context to access both the Dockerfile and the `app/` directory
- **Docker Command = empty**: The Dockerfile already has `CMD ["uvicorn", "main:app", ...]`

## Common Mistakes

❌ **Wrong**: Root Directory = `./app`  
✅ **Correct**: Root Directory = `.` or empty

❌ **Wrong**: Dockerfile Path = `app/Dockerfile`  
✅ **Correct**: Dockerfile Path = `./Dockerfile`

❌ **Wrong**: Docker Build Context = `app/`  
✅ **Correct**: Docker Build Context = `.`

## Visual Guide

```
Repository Root (.)
├── Dockerfile          ← Dockerfile Path: ./Dockerfile
├── render.yaml
├── app/                ← Code is here
│   ├── main.py
│   ├── model.h5
│   └── requirements.txt
└── frontend/
```

The Dockerfile copies from `./app` because the build context is `.` (root).

