from fastapi import FastAPI , UploadFile
from fastapi.middleware.cors import CORSMiddleware
import  tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Get allowed origins from environment variable
# Default to localhost for development if not set
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

print(f"CORS allowed origins: {allowed_origins}")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.h5')

print(f"Loading model from: {MODEL_PATH}")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")

@app.get("/")
def home():
    return {"It is working."}

@app.post("/predict")
async def check(file:UploadFile):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_resized = image.resize((256, 256))
    file = np.array([image_resized])/255
    pred=model.predict(file, verbose=0)
    if pred[0,0] >= 0.5:
        return {
                "msg": "COVID-19 found. Consult a doctor",
            "code":1
            }
    else :
        return {
            "msg": "COVID-19 not found. You are fine!!",
            "code":0
                }
