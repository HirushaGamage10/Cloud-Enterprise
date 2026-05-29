variable "environment" {}
variable "project" {}

data "archive_file" "lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/function.zip"
  source {
    content  = <<EOF
import json

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event))
    print("Simulating sending confirmation email to user...")
    return {
        'statusCode': 200,
        'body': json.dumps('Confirmation email sent successfully!')
    }
EOF
    filename = "index.py"
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.project}-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "email_sender" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.project}-email-notifier-${var.environment}"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.lambda_handler"
  runtime          = "python3.12"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  tags = {
    Environment = var.environment
    Service     = "EmailNotifier"
  }
}
