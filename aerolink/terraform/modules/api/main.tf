resource "aws_apigatewayv2_api" "aerolink_api" {
  name          = "aerolink-http-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["*"]
    allow_headers = ["*"]
  }
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/api-gw/${aws_apigatewayv2_api.aerolink_api.name}"
  retention_in_days = 7
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.aerolink_api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    format          = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }
}

# Flight Service
resource "aws_apigatewayv2_integration" "flight" {
  api_id           = aws_apigatewayv2_api.aerolink_api.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://a00a246f368af4e5280c67a49da4976c-1599913055.eu-west-1.elb.amazonaws.com/flights"
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
  integration_uri  = "http://ab7604f3a2ed545c68d4a398fe9907ce-342302779.eu-west-1.elb.amazonaws.com/bookings"
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
  integration_uri  = "http://aa634ab5645594dd685e7b82d0d28ad6-2126889744.eu-west-1.elb.amazonaws.com/baggage"
  integration_method = "ANY"
}
resource "aws_apigatewayv2_route" "baggage_root" {
  api_id    = aws_apigatewayv2_api.aerolink_api.id
  route_key = "ANY /api/v1/baggage"
  target    = "integrations/${aws_apigatewayv2_integration.baggage.id}"
}
