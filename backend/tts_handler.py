import json
import boto3
import uuid
import os

def lambda_handler(event, context):
    # CORS headers for all responses
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    }
    
    try:
        # Handle OPTIONS requests for CORS
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": ""
            }
        
        # AWS clients
        polly = boto3.client("polly")
        s3 = boto3.client("s3")
        
        # Get bucket name from environment variable
        bucket_name = os.environ.get("BUCKET_NAME")
        
        # Event path (API Gateway provides this)
        path = event.get("path", "")
        body = {}
        if event.get("body"):
            body = json.loads(event["body"])

        # Handle /voices endpoint
        if path.endswith("/voices"):
            response = polly.describe_voices()
            voices = response["Voices"]

            # Keep only major English accents
            english_accents = [
                "US English", "British English", "Australian English",
                "Indian English", "Welsh English", "South African English",
                "New Zealand English", "Irish English"
            ]
            filtered_voices = [
                {
                    "Id": v["Id"],
                    "Name": v["Name"],
                    "Gender": v["Gender"],
                    "LanguageName": v["LanguageName"]
                }
                for v in voices if v["LanguageName"] in english_accents
            ]

            return {
                "statusCode": 200,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps(filtered_voices)
            }

        # Handle /convert endpoint
        elif path.endswith("/convert"):
            text = body.get("text", "")
            voice_id = body.get("voiceId", "Joanna")

            if not text:
                return {
                    "statusCode": 400,
                    "headers": {**cors_headers, "Content-Type": "application/json"},
                    "body": json.dumps({"error": "No text provided"})
                }

            # Call Polly to synthesize speech
            response = polly.synthesize_speech(
                Text=text,
                OutputFormat="mp3",
                VoiceId=voice_id
            )

            # Save audio to S3
            audio_stream = response["AudioStream"].read()
            file_name = f"{uuid.uuid4()}.mp3"

            s3.put_object(
                Bucket=bucket_name,
                Key=file_name,
                Body=audio_stream,
                ContentType="audio/mpeg"
            )

            # Public URL of audio file
            audio_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"

            return {
                "statusCode": 200,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({"audioUrl": audio_url})
            }

        # Invalid route
        else:
            return {
                "statusCode": 404,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Invalid route"})
            }

    except Exception as e:
        print(f"Lambda Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {**cors_headers, "Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }