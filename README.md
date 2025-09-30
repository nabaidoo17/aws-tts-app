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

## Architecture

<img width="601" height="373" alt="TTS Architecture Diagram" src="https://github.com/user-attachments/assets/1703aa51-2d8d-45bc-859b-306618071b83" />


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
