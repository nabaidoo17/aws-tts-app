# Package the Lambda
resource "null_resource" "zip_lambda" {
  provisioner "local-exec" {
    command = "cd ../backend && powershell Compress-Archive -Path tts_handler.py -DestinationPath tts.zip -Force"
  }
}

# Lambda function
resource "aws_lambda_function" "tts_lambda" {
  function_name = "tts-lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "tts_handler.lambda_handler"
  runtime       = "python3.9"

  filename         = "${path.module}/../backend/tts.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/tts.zip")

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.audio_bucket.bucket
    }
  }

  depends_on = [null_resource.zip_lambda]
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tts_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.tts_api.execution_arn}/*/*"
}
