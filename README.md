# AWS Text-to-Speech App

A full-stack text-to-speech application using AWS Polly, Lambda, and React.

## Project Structure

```
aws-tts-app/
├── frontend/          # React application
├── backend/           # Lambda function code
├── infrastructure/    # Terraform AWS resources
└── README.md         # This file
```

## Quick Start

### 1. Deploy Infrastructure
```bash
cd infrastructure
terraform init
terraform apply
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application
Open http://localhost:5173 in your browser

## Features

- Convert text to speech using AWS Polly
- Multiple voice options
- Audio playback and download
- Dark minimalist UI