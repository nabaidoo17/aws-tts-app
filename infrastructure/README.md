# Infrastructure

This directory contains all Terraform configuration files for the AWS Text-to-Speech application.

## Deployment

```bash
terraform init
terraform plan
terraform apply
```

## Resources Created

- Lambda function for TTS processing
- API Gateway for REST endpoints
- S3 bucket for audio file storage
- IAM roles and policies