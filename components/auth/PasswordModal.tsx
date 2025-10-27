import React, { useState } from 'react';

interface PasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = "1223445";

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4 animate-fade-in-up relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" aria-label="Close">&times;</button>
        <h2 className="text-3xl font-bold text-white text-center mb-2">Admin Access Required</h2>
        <p className="text-gray-400 text-center mb-6">Please enter the password to access the dashboard.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!password.trim()}
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
