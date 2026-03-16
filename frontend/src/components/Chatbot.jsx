import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage } from '../actions/chatActions';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendChatMessage(input));
      setInput('');
    }
  };

  return (
    <div className="chatbot-wrapper">
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Help Bot</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className="chatbot-message">
                <p>{msg.reply}</p>
              </div>
            ))}
            {error && <p className="error">{error}</p>}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
