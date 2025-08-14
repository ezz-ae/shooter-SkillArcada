import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'shooter';
}

const ShoterChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
      };
      setMessages([...messages, newUserMessage]);
      setInput('');

      // Simulate a response from Shoter (replace with actual logic)
      setTimeout(() => {
        const newShoterMessage: Message = {
          id: messages.length + 2,
          text: `Shoter says: "${input}" is an interesting thought.`,
          sender: 'shooter',
        };
        setMessages((prevMessages) => [...prevMessages, newShoterMessage]);
      }, 1000);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-hsl(var(--primary)/10%) rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Say Hi to Shoter</h1>
        <p className="text-gray-600 mt-1">Ask Shoter how to win.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-200 text-gray-800 self-start mr-auto'
            }`}
            style={{ maxWidth: '80%' }}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center bg-white rounded-md border border-gray-300 shadow-sm">
          <input
            type="text"
            className="flex-1 px-4 py-2 outline-none bg-transparent"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoterChat;