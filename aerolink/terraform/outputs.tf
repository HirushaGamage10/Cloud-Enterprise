output "vpc_id" {
  value = module.networking.vpc_id
}

output "eks_cluster_endpoint" {
  value = module.compute.cluster_endpoint
}

output "aurora_cluster_endpoint" {
  value = module.database.aurora_endpoint
}

output "api_gateway_endpoint" {
  value = module.api.api_endpoint
}

output "frontend_s3_url" {
  value = module.frontend.website_endpoint
}
output "ecr_booking_repo" {
  value = module.ecr.booking_repo_url
}
