import React, { useState, useRef, useEffect } from 'react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your AI Shopping Assistant. How can I help you pick the perfect product today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        text: data.success ? data.text : "Sorry, I'm having trouble connecting to my AI core.", 
        sender: 'ai' 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error: My backend systems seem to be offline.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chat-container ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chat-window glass-panel">
          <div className="chat-header">
            <h3>AI Assistant ✨</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble ai typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-form">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask me anything..." 
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <button className="chat-fab" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
