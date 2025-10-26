import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          <span className="text-blue-400">AI</span> Quote Studio
        </h1>
      </nav>
    </header>
  );
};

export default Header;