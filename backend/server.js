import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Available voices endpoint
app.get('/api/voices', (req, res) => {
  const voices = [
    { id: 'en-US-female', name: 'English (US) - Female', lang: 'en-US', gender: 'female' },
    { id: 'en-US-male', name: 'English (US) - Male', lang: 'en-US', gender: 'male' },
    { id: 'en-GB-female', name: 'English (UK) - Female', lang: 'en-GB', gender: 'female' },
    { id: 'en-GB-male', name: 'English (UK) - Male', lang: 'en-GB', gender: 'male' },
    { id: 'es-ES-female', name: 'Spanish - Female', lang: 'es-ES', gender: 'female' },
    { id: 'fr-FR-female', name: 'French - Female', lang: 'fr-FR', gender: 'female' }
  ];
  res.json(voices);
});

// Convert text endpoint (returns voice settings)
app.post('/api/convert', (req, res) => {
  const { text, voiceId } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Return voice configuration for frontend
  const voiceConfig = {
    text,
    voiceId,
    success: true
  };

  res.json(voiceConfig);
});

app.listen(PORT, () => {
  console.log(`TTS Backend running on http://localhost:${PORT}`);
});