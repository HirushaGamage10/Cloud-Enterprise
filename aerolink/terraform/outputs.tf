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
