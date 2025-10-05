import React, { useState } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const AIHelper = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: 'user', text: input }]);
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('ai-helper', { prompt: input });
      setMessages((prev) => [
        ...prev,
        { from: 'ai', text: res.data.response }
      ]);
      setInput('');
    } catch (err) {
      setError('AI helper is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/90 rounded-2xl shadow-xl border border-indigo-100 p-4">
      <div className="flex items-center gap-2 mb-2">
      </div>
      <div className="flex-1 overflow-y-auto mb-2 space-y-2 pr-1">
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`rounded-lg px-3 py-2 text-sm max-w-[90%] ${msg.from === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-indigo-50 self-start text-left'}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-indigo-400 text-xs">Thinking...</div>}
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>
      <form onSubmit={sendMessage} className="flex items-center gap-2 mt-2">
        <input
          type="text"
          className="flex-1 rounded-full border border-indigo-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-indigo-600 hover:to-blue-600 shadow disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AIHelper;
