# COVID-19 Detection Backend

FastAPI backend for COVID-19 detection from X-ray images using TensorFlow.

## Setup

### 1. Install Dependencies

```bash
cd app
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and configure your settings:

```env
# Allowed CORS origins (comma-separated)
# For local development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# For production (replace with your frontend domain)
# ALLOWED_ORIGINS=https://your-frontend-domain.com

# Server configuration (optional)
HOST=0.0.0.0
PORT=8000
```

### 3. Run the Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/

## API Endpoints

### POST /predict
Upload an X-ray image for COVID-19 detection.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response:**
```json
{
  "msg": "COVID-19 found. Consult a doctor",
  "code": 1
}
```
or
```json
{
  "msg": "COVID-19 not found. You are fine!!",
  "code": 0
}
```

## CORS Configuration

The backend uses CORS middleware to allow requests from specified origins. Configure allowed origins in the `.env` file using the `ALLOWED_ORIGINS` variable.

For production, make sure to set `ALLOWED_ORIGINS` to your frontend domain(s).
