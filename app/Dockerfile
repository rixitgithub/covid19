FROM python:3.11.9-slim

# Install Git and Git LFS
RUN apt-get update && apt-get install -y \
    git \
    git-lfs \
    && rm -rf /var/lib/apt/lists/*

# Initialize Git LFS
RUN git lfs install

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--port", "8000", "--host", "0.0.0.0"]
