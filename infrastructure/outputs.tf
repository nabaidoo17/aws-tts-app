output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = "${aws_api_gateway_rest_api.tts_api.execution_arn}/dev"
}

output "api_gateway_invoke_url" {
  description = "API Gateway invoke URL"
  value       = "https://${aws_api_gateway_rest_api.tts_api.id}.execute-api.${var.aws_region}.amazonaws.com/dev"
}

output "s3_bucket_name" {
  description = "S3 bucket name for audio files"
  value       = aws_s3_bucket.audio_bucket.bucket
}