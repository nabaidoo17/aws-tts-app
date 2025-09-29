import { useState, useEffect } from "react";

function App() {
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState("en-US-female");
  const [voices, setVoices] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://214lim6qj4.execute-api.us-east-1.amazonaws.com/dev";

  useEffect(() => {
    async function fetchVoices() {
      try {
        const res = await fetch(`${API_BASE}/voices`);
        const data = await res.json();
        setVoices(data);
      } catch (err) {
        console.error("Error loading voices:", err);
      }
    }
    fetchVoices();
  }, []);

  const speakText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setAudioUrl(null);
    
    try {
      // Send to AWS Lambda for Polly conversion
      const res = await fetch(`${API_BASE}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Conversion failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      
      // Set audio URL for playback
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
      }
    } catch (err) {
      console.error("Error:", err);
      alert(`Failed to convert text: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        alert("Audio playback failed");
      };
      audio.play();
    }
  };

  return (
    <div className="container">
      <h1>Text to Speech</h1>
      
      <div className="form-group">
        <textarea
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="form-group">
        <select
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
        >
          {voices.map((v) => (
            <option key={v.Id} value={v.Id}>
              {v.Name} ({v.Gender}) - {v.LanguageName}
            </option>
          ))}
        </select>
      </div>

      <button 
        onClick={speakText} 
        disabled={loading || !text.trim()}
      >
        {loading ? "Converting..." : "Convert to Speech"}
      </button>

      {audioUrl && (
        <div className="audio-section">
          <audio controls src={audioUrl}></audio>
          <div className="button-group">
            <button onClick={playAudio} disabled={isPlaying}>
              {isPlaying ? "Playing..." : "Play"}
            </button>
            <a href={audioUrl} download="speech.mp3" className="download-link">
              Download MP3
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
