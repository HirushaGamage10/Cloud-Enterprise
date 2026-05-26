#!/bin/bash
set -e

# AWS Account configuration
export AWS_REGION="eu-west-1"
export AWS_ACCOUNT_ID="806490632128"
export ECR_BASE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

export COMMIT_HASH=$(git rev-parse --short HEAD)

echo "🔐 Authenticating with AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BASE

echo "🚀 Building and pushing Flight Service..."
cd flight-service
docker build --platform linux/amd64 -t aerolink-flight-service:latest .
docker tag aerolink-flight-service:latest $ECR_BASE/aerolink-flight-service:latest
docker tag aerolink-flight-service:latest $ECR_BASE/aerolink-flight-service:$COMMIT_HASH
docker push $ECR_BASE/aerolink-flight-service:latest
docker push $ECR_BASE/aerolink-flight-service:$COMMIT_HASH
cd ..

echo "🚀 Building and pushing Booking Service..."
cd booking-service
docker build --platform linux/amd64 -t aerolink-booking-service:latest .
docker tag aerolink-booking-service:latest $ECR_BASE/aerolink-booking-service:latest
docker tag aerolink-booking-service:latest $ECR_BASE/aerolink-booking-service:$COMMIT_HASH
docker push $ECR_BASE/aerolink-booking-service:latest
docker push $ECR_BASE/aerolink-booking-service:$COMMIT_HASH
cd ..

echo "🚀 Building and pushing Baggage Service..."
cd baggage-service
docker build --platform linux/amd64 -t aerolink-baggage-service:latest .
docker tag aerolink-baggage-service:latest $ECR_BASE/aerolink-baggage-service:latest
docker tag aerolink-baggage-service:latest $ECR_BASE/aerolink-baggage-service:$COMMIT_HASH
docker push $ECR_BASE/aerolink-baggage-service:latest
docker push $ECR_BASE/aerolink-baggage-service:$COMMIT_HASH
cd ..

echo "✅ All backend microservices have been successfully built and pushed to AWS ECR!"
echo "🔄 ArgoCD will now detect the changes in your Git repository and pull the new images automatically."
