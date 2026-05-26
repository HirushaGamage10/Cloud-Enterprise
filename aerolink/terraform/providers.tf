terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # For a production setup, you would typically use an S3 backend for state
  # backend "s3" {
  #   bucket = "aerolink-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "eu-west-1"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "AeroLink"
      ManagedBy   = "Terraform"
    }
  }
}
