resource "aws_dynamodb_table" "flight_schedules" {
  name           = "AeroLinkFlightSchedules-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "flight_id"

  attribute {
    name = "flight_id"
    type = "S"
  }

  server_side_encryption { enabled = true }

  # Multi-Region Deployment (Task 1 Requirement)
  # This creates a DynamoDB Global Table that replicates data to a second region
  replica {
    region_name = "eu-central-1"
  }
}

resource "aws_db_instance" "aurora_bookings" {
  identifier              = "aerolink-db-${var.environment}"
  engine                  = "postgres"
  instance_class          = "db.t3.micro" # Free tier eligible
  allocated_storage       = 20
  db_name                 = "aerolinkdb"
  username                = "dbadmin"
  password                = var.db_master_password
  storage_encrypted       = false # KMS might cost extra on strict free tier
  db_subnet_group_name    = var.database_subnet_group_name
  vpc_security_group_ids  = var.vpc_security_group_ids
  skip_final_snapshot     = true
  publicly_accessible     = true # Because we disabled NAT gateways
}
