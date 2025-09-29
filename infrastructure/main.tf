provider "aws" {
  region = var.aws_region
}

# Random suffix for unique bucket names
resource "random_id" "bucket_id" {
  byte_length = 4
}

# S3 bucket for audio storage
resource "aws_s3_bucket" "audio_bucket" {
  bucket        = "tts-audio-storage-${random_id.bucket_id.hex}"
  force_destroy = true
}

# S3 bucket public access
resource "aws_s3_bucket_public_access_block" "audio_bucket_pab" {
  bucket = aws_s3_bucket.audio_bucket.id
  
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "audio_bucket_policy" {
  bucket = aws_s3_bucket.audio_bucket.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.audio_bucket.arn}/*"
      }
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.audio_bucket_pab]
}
