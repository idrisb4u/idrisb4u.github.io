import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { RESUME_TEXT, SYSTEM_INSTRUCTION, SUGGESTION_QUESTIONS } from '../context';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi, I'm Idris's AI twin. I have full context on my experience leading AI Innovation & Delivery at Eaton. Ask me anything about my career, strategy, or how I run AI Factories!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const userText = textToSend || input;
    if (!userText.trim()) return;

    if (!textToSend) {
      setInput('');
    }

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'bot',
            text: "Error: Gemini API Key not found in environment. Please check that .env is configured correctly.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true
          }
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // Build conversation turns for Gemini
      // Ground the conversation using the resume text
      const requestContents = [
        {
          role: 'user',
          parts: [{ text: `Here is the professional resume and background of Idris Ali:\n\n${RESUME_TEXT}\n\nGround all your responses in this context.` }]
        },
        {
          role: 'model',
          parts: [{ text: "Understood. I am Idris Ali's AI advisor. I will speak in the first person as Idris Ali and answer all questions based exactly on this professional resume and background context." }]
        }
      ];

      // Add actual dialogue history
      // We filter out welcome message and map roles
      messages.forEach(msg => {
        if (msg.id === 'welcome' || msg.isError) return;
        requestContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      // Add current message
      requestContents.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: requestContents,
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1000,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!botResponseText) {
        throw new Error("Invalid API response format");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: botResponseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setError("Unable to get response from Gemini. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: "My apologizes, I ran into a connection issue. Can you please re-ask that question?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(17, 24, 39, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.95rem',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)'
          }}>
            IA
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Ask Idris</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot"></span> Online & Active
            </span>
          </div>
        </div>
        <Sparkles size={18} style={{ color: 'var(--accent-cyan)', opacity: 0.8 }} />
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              {msg.sender === 'bot' ? (
                <>
                  <span style={{ 
                    width: '14px', 
                    height: '14px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.5rem',
                    fontWeight: 700
                  }}>IA</span>
                  <span>Idris</span>
                </>
              ) : (
                <>
                  <User size={12} />
                  <span>Visitor</span>
                </>
              )}
              <span>•</span>
              <span>{msg.time}</span>
            </div>
            
            <div style={{
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.sender === 'user' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))' 
                : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid',
              borderColor: msg.sender === 'user' ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-color)',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              color: msg.isError ? '#ef4444' : 'var(--text-primary)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ 
                width: '14px', 
                height: '14px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', 
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.5rem',
                fontWeight: 700
              }}>IA</span>
              <span>Idris is typing...</span>
            </div>
            <div style={{
              padding: '12px 18px',
              borderRadius: '16px 16px 16px 4px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <span className="dot-blink" style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.4s infinite both' }}></span>
              <span className="dot-blink" style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.4s infinite both 0.2s' }}></span>
              <span className="dot-blink" style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.4s infinite both 0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && !isLoading && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Suggested Questions:</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
            {SUGGESTION_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 99, 235, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: 'rgba(10, 15, 30, 0.5)' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask Idris anything..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'var(--transition-smooth)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: input.trim() ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))' : 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: input.trim() ? '#0b0f19' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'default',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
      `}</style>
    </div>
  );
}
