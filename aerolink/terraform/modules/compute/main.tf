module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.3"

  cluster_name    = "aerolink-eks-${var.environment}"
  cluster_version = "1.30"

  vpc_id                         = var.vpc_id
  subnet_ids                     = var.public_subnets
  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    core = {
      min_size     = 2
      max_size     = 6
      desired_size = 5
      instance_types = ["t3.micro"]
      capacity_type  = "ON_DEMAND"
    }
  }
}
