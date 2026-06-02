module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.33.0"

  cluster_name    = "aerolink-eks-${var.environment}"
  cluster_version = "1.30"

  vpc_id                         = var.vpc_id
  subnet_ids                     = var.public_subnets
  cluster_endpoint_public_access = true

  cluster_addons = {
    coredns                         = {}
    kube-proxy                      = {}
    vpc-cni                         = {}
    amazon-cloudwatch-observability = {}
    aws-ebs-csi-driver              = {}
  }

  eks_managed_node_groups = {
    core = {
      min_size     = 2
      max_size     = 5
      desired_size = 4
      instance_types = ["t3.small"]
      capacity_type  = "ON_DEMAND"

      iam_role_additional_policies = {
        CloudWatchAgentServerPolicy = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
        AmazonEBSCSIDriverPolicy    = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
      }
    }
  }
}
