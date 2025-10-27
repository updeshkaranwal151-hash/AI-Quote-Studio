import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginModal: React.FC = () => {
  const [name, setName] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome to Quote Studio</h2>
        <p className="text-gray-400 text-center mb-6">Please enter your name to continue.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!name.trim()}
          >
            Enter Studio
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
