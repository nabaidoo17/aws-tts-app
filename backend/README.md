# Backend

AWS Lambda function using Amazon Polly for text-to-speech conversion.

## Deployment

Deploy via Terraform from the infrastructure directory:

```bash
cd ../infrastructure
terraform init
terraform apply
```

## Endpoints

- `GET /voices` - List available Polly voices
- `POST /convert` - Convert text to speech using Polly

## Files

- `tts_handler.py` - Lambda function code
- `tts.zip` - Deployment package (auto-generated)