#!/bin/bash
set -e

# Install Git LFS
echo "Installing Git LFS..."
git lfs install

# Pull LFS objects
echo "Pulling LFS objects..."
git lfs pull

# Verify model file exists
if [ ! -f "app/model.h5" ]; then
  echo "ERROR: model.h5 not found after LFS pull"
  exit 1
fi

echo "Model file verified: $(ls -lh app/model.h5 | awk '{print $5}')"

# Continue with your build process
echo "Build process continuing..."
