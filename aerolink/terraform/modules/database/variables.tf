variable "environment" { type = string }
variable "db_master_password" { type = string }
variable "database_subnet_group_name" { type = string }
variable "vpc_security_group_ids" { type = list(string) }
