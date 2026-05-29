variable "environment" {}
variable "project" {}
variable "eks_cluster_name" {}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project}-Operational-Dashboard-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/EKS", "cluster_failed_node_count", "ClusterName", var.eks_cluster_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "eu-west-1"
          title   = "EKS Cluster Failed Nodes"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "${var.project}-db-${var.environment}"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "eu-west-1"
          title   = "RDS Database CPU Utilization"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", "${var.project}-email-notifier-${var.environment}"],
            [".", "Errors", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "eu-west-1"
          title   = "Lambda Email Notifier Metrics"
        }
      }
    ]
  })
}
