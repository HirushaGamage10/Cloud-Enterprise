module "networking" {
  source      = "./modules/networking"
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  aws_region  = var.aws_region
}

module "compute" {
  source          = "./modules/compute"
  environment     = var.environment
  vpc_id          = module.networking.vpc_id
  public_subnets  = module.networking.public_subnets
}

module "database" {
  source                     = "./modules/database"
  environment                = var.environment
  db_master_password         = var.db_master_password
  database_subnet_group_name = module.networking.database_subnet_group_name
  vpc_security_group_ids     = [module.networking.default_security_group_id]
}

module "api" {
  source      = "./modules/api"
  environment = var.environment
}

module "frontend" {
  source = "./modules/frontend"
}

module "ecr" {
  source = "./modules/ecr"
}
