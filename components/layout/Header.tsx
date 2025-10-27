import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { View } from '../../App';

interface HeaderProps {
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  const { currentUser } = useAuth();

  const handleProfileClick = () => {
    if (currentUser) {
      setView({ page: 'profile', userId: currentUser.id });
    }
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-black/20 border-b border-gray-700">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          <span className="text-blue-400">Quote</span> Studio
        </h1>
        {currentUser && (
          <button onClick={handleProfileClick} className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="text-white font-medium hidden sm:block">{currentUser.name}</span>
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-blue-500" />
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;