import React, { useState, useMemo } from 'react';
import QuoteGrid from '../quotes/QuoteGrid';
import { useQuotes } from '../../hooks/useQuotes';
import SearchBar from './SearchBar';
import UploadModal from '../quotes/UploadModal';
import { QuoteContent } from '../../types';
import QuoteDetailModal from '../quotes/QuoteDetailModal';
import { View } from '../../App';


type SortOption = 'Newest' | 'Most Liked';

const UserPanel: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
  const { quotes, likedQuotes, toggleLike } = useQuotes();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('Newest');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteContent | null>(null);

  const filteredAndSortedQuotes = useMemo(() => {
    let processedQuotes = [...quotes]; 

    if (activeCategory !== 'All') {
      processedQuotes = processedQuotes.filter((quote) => quote.category === activeCategory);
    }
    
    if (searchTerm) {
        processedQuotes = processedQuotes.filter((quote) => 
            quote.quoteText.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (sortOption === 'Newest') {
        processedQuotes.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortOption === 'Most Liked') {
        processedQuotes.sort((a, b) => b.likes - a.likes);
    }

    return processedQuotes;
  }, [quotes, activeCategory, searchTerm, sortOption]);

  const handleAuthorClick = (authorId: string) => {
    setSelectedQuote(null); // Close modal if open
    setView({ page: 'profile', userId: authorId });
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="px-6 mt-4">
            <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            >
                + Create Your Own Quote
            </button>
        </div>

        <SearchBar 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        <QuoteGrid 
            quotes={filteredAndSortedQuotes} 
            likedQuotes={likedQuotes} 
            onLike={toggleLike} 
            onCardClick={setSelectedQuote}
            onAuthorClick={handleAuthorClick}
        />
      </div>
      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
      {selectedQuote && (
        <QuoteDetailModal
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
            onAuthorClick={handleAuthorClick}
            isLiked={likedQuotes.has(selectedQuote.id)}
            onLike={toggleLike}
        />
      )}
    </>
  );
};

export default UserPanel;
