import React from 'react';
import { QuoteContent } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface QuoteCardProps {
  quote: QuoteContent;
  isLiked: boolean;
  onLike: (id: string) => void;
  onCardClick: (quote: QuoteContent) => void;
  onAuthorClick: (authorId: string) => void;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLiked, onLike, onCardClick, onAuthorClick, showDelete = false, onDelete }) => {
  const { users } = useAuth();
  const author = users[quote.authorId] || { name: 'Unknown', avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=unknown` };

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(quote.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const fileName = `${quote.quoteText.substring(0, 20).replace(/\s/g, '_')}.jpg`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Could not download the file.');
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(quote.id);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAuthorClick(quote.authorId);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(quote.id);
  };

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 bg-gray-800 animate-fade-in-up cursor-pointer"
      onClick={() => onCardClick(quote)}
    >
      <img
        src={quote.imageUrl}
        alt={quote.quoteText}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-center font-serif italic text-lg">{quote.quoteText}</p>
      </div>
      
      {showDelete && (
         <button onClick={handleDeleteClick} className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-red-600 transition-colors focus:outline-none z-20" aria-label="Delete quote">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
         </button>
      )}

      <div className="absolute top-2 left-2 flex items-center gap-2">
        <span className="bg-black/50 text-white text-xs font-bold py-1 px-2 rounded-full backdrop-blur-sm">
          {quote.category}
        </span>
      </div>
      
      <div className="absolute bottom-2 right-2 flex items-center space-x-2">
        <button onClick={handleDownloadClick} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:text-green-400 transition-colors focus:outline-none" aria-label="Download quote">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        <button onClick={handleLikeClick} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:text-red-500 transition-colors focus:outline-none" aria-label="Like quote">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" className={isLiked ? 'text-red-500' : 'text-white/70'} /></svg>
        </button>
        <span className="text-white text-sm font-bold bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">{quote.likes}</span>
      </div>
      
      <button onClick={handleAuthorClick} className="absolute bottom-2 left-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
          <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full border-2 border-gray-500" />
          <span className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full">{author.name}</span>
      </button>
    </div>
  );
};

export default QuoteCard;