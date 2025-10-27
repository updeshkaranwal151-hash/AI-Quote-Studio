import React from 'react';
import { QuoteContent } from '../../types';
import QuoteCard from './QuoteCard';

interface QuoteGridProps {
  quotes: QuoteContent[];
  likedQuotes: Set<string>;
  onLike: (id: string) => void;
  onCardClick: (quote: QuoteContent) => void;
  onAuthorClick: (authorId: string) => void;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

const QuoteGrid: React.FC<QuoteGridProps> = ({ quotes, likedQuotes, onLike, onCardClick, onAuthorClick, showDelete, onDelete }) => {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-400">No quotes found.</h2>
        <p className="text-gray-500">Try a different filter or check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {quotes.map((quote) => (
        <QuoteCard 
          key={quote.id} 
          quote={quote} 
          isLiked={likedQuotes.has(quote.id)}
          onLike={onLike}
          onCardClick={onCardClick}
          onAuthorClick={onAuthorClick}
          showDelete={showDelete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default QuoteGrid;