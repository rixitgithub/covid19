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
COPY ./app/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY ./app .

# Pull LFS objects if needed (for local builds)
# In Render, Git LFS should be handled during the build process
RUN if [ -f .gitattributes ]; then git lfs pull || true; fi

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--port", "8000", "--host", "0.0.0.0"]