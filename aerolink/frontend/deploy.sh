#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting AeroLink Frontend Local Deployment..."

# Step 1: Navigate to the frontend directory
cd "$(dirname "$0")"

# Step 2: Install dependencies (just in case)
echo "📦 Installing Node.js dependencies..."
npm install

# Step 3: Build the React application for production
echo "🔨 Building the React application..."
npm run build

# Step 4: Automatically find the S3 Bucket Name
echo "🔍 Finding the S3 Bucket..."
BUCKET_NAME=$(aws s3api list-buckets --query "Buckets[?starts_with(Name, 'aerolink-frontend-')].Name" --output text)

if [ -z "$BUCKET_NAME" ]; then
  echo "❌ Error: Could not find an S3 bucket starting with 'aerolink-frontend-'"
  echo "Are your AWS credentials configured locally?"
  exit 1
fi

echo "✅ Found S3 Bucket: $BUCKET_NAME"

# Step 5: Sync the compiled files to S3
echo "☁️ Syncing files to Amazon S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

echo "🎉 Deployment Complete!"
echo "🌐 Your website is live at: http://$BUCKET_NAME.s3-website-eu-west-1.amazonaws.com"
