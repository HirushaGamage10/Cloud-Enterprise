# Route 53 Configuration for Multi-Region Failover Routing
# This demonstrates the Traffic Layer for High Availability and Disaster Recovery (Task 1 & 5)

resource "aws_route53_zone" "aerolink_primary" {
  name = "aerolink-enterprise.com"
  comment = "Primary DNS zone for AeroLink Multi-Region Deployment"
}

# Health Check to monitor the Primary API
resource "aws_route53_health_check" "primary_api_hc" {
  fqdn              = "api-primary.aerolink-enterprise.com"
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = "3"
  request_interval  = "30"

  tags = {
    Name = "aerolink-primary-health-check"
  }
}

# Primary Region API Endpoint (Active)
resource "aws_route53_record" "api_primary" {
  zone_id = aws_route53_zone.aerolink_primary.zone_id
  name    = "api.aerolink-enterprise.com"
  type    = "A"
  
  # Traffic goes here normally
  failover_routing_policy {
    type = "PRIMARY"
  }

  set_identifier = "Primary-Region-Active"
  
  # In a real setup, this points to the Primary EKS Application Load Balancer
  records = ["10.0.101.50"]
  ttl     = 60

  health_check_id = aws_route53_health_check.primary_api_hc.id
}

# Secondary Region API Endpoint (Passive / Backup)
resource "aws_route53_record" "api_secondary" {
  zone_id = aws_route53_zone.aerolink_primary.zone_id
  name    = "api.aerolink-enterprise.com"
  type    = "A"
  
  # Traffic only comes here if the PRIMARY health check fails
  failover_routing_policy {
    type = "SECONDARY"
  }

  set_identifier = "Secondary-Region-Passive"
  
  # In a real setup, this points to the Secondary EKS Application Load Balancer
  records = ["10.1.101.50"]
  ttl     = 60
}
