resource "aws_apigatewayv2_api" "aerolink_api" {
  name          = "aerolink-http-api-${var.environment}"
  protocol_type = "HTTP"
}
