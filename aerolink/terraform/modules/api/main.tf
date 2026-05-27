resource "aws_apigatewayv2_api" "aerolink_api" {
  name          = "aerolink-http-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["*"]
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.aerolink_api.id
  name        = "$default"
  auto_deploy = true
}

# Flight Service
resource "aws_apigatewayv2_integration" "flight" {
  api_id           = aws_apigatewayv2_api.aerolink_api.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://a06054c5321c045a896e51f10ce86a52-749940121.eu-west-1.elb.amazonaws.com/api/v1/flights"
  integration_method = "ANY"
}
resource "aws_apigatewayv2_route" "flight_root" {
  api_id    = aws_apigatewayv2_api.aerolink_api.id
  route_key = "ANY /api/v1/flights"
  target    = "integrations/${aws_apigatewayv2_integration.flight.id}"
}

# Booking Service
resource "aws_apigatewayv2_integration" "booking" {
  api_id           = aws_apigatewayv2_api.aerolink_api.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://a0f15be5a44084ef8a0bf90c8ca713cb-1205642314.eu-west-1.elb.amazonaws.com/api/v1/bookings"
  integration_method = "ANY"
}
resource "aws_apigatewayv2_route" "booking_root" {
  api_id    = aws_apigatewayv2_api.aerolink_api.id
  route_key = "ANY /api/v1/bookings"
  target    = "integrations/${aws_apigatewayv2_integration.booking.id}"
}

# Baggage Service
resource "aws_apigatewayv2_integration" "baggage" {
  api_id           = aws_apigatewayv2_api.aerolink_api.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://afaef53307e104d23bd8b58eb7aa318b-92331643.eu-west-1.elb.amazonaws.com/api/v1/baggage"
  integration_method = "ANY"
}
resource "aws_apigatewayv2_route" "baggage_root" {
  api_id    = aws_apigatewayv2_api.aerolink_api.id
  route_key = "ANY /api/v1/baggage"
  target    = "integrations/${aws_apigatewayv2_integration.baggage.id}"
}
