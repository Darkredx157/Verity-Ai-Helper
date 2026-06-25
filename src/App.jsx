import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Mic } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello, I'm Verity, your personal helper friend. Ask me everything, I know everything." }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Working Voice Recorder feature
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const text = event.results.transcript;
        setInput(text);
      };

      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return alert("Voice speech not supported in this browser.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: messages })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, connection error occurred." }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="avatar">😊</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>Verity</h3>
          <small style={{ color: '#a1a1aa' }}>AI Companion Matrix</small>
        </div>
        <button className="icon-btn" onClick={() => setMessages([{ role: 'bot', text: "Hello, I'm Verity, your personal helper friend. Ask me everything, I know everything." }])}>
          <Trash2 size={20} />
        </button>
      </div>

      <div className="messages-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="avatar">{msg.role === 'bot' ? '😊' : '👤'}</div>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <button className={`icon-btn ${isListening ? 'active' : ''}`} onClick={toggleVoice}>
          <Mic size={20} />
        </button>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Verity anything..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="icon-btn" onClick={handleSend} style={{ background: '#2563eb' }}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
