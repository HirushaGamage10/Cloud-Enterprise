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
  region = var.aws_region # Set to eu-west-1 (Ireland) for GDPR Data Locality

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "AeroLink"
      ManagedBy   = "Terraform"
      Compliance  = "GDPR-EU"
    }
  }
}
