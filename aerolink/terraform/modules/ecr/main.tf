resource "aws_ecr_repository" "booking" {
  name         = "aerolink-booking-service"
  force_delete = true
}

resource "aws_ecr_repository" "flight" {
  name         = "aerolink-flight-service"
  force_delete = true
}

resource "aws_ecr_repository" "baggage" {
  name         = "aerolink-baggage-service"
  force_delete = true
}

output "booking_repo_url" {
  value = aws_ecr_repository.booking.repository_url
}

output "flight_repo_url" {
  value = aws_ecr_repository.flight.repository_url
}

output "baggage_repo_url" {
  value = aws_ecr_repository.baggage.repository_url
}
