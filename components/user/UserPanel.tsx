import React, { useState, useMemo, useEffect, useRef } from 'react';
import QuoteGrid from '../quotes/QuoteGrid';
import { useQuotes } from '../../hooks/useQuotes';
import SearchBar from './SearchBar';
import { generateQuoteImage, generateQuoteText } from '../../services/geminiService';
import { CATEGORIES } from '../../types';
import Spinner from '../common/Spinner';

type SortOption = 'Newest' | 'Most Liked';
const THEMES = ['Minimalist', 'Cinematic', 'Vibrant Abstract', 'Dark Academia', 'Cyberpunk', 'Fantasy Landscape', 'Surreal'];
const GENERATION_LIMIT = 50;

const UserPanel: React.FC = () => {
  const { quotes, likedQuotes, toggleLike, addQuote } = useQuotes();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('Newest');
  const [generationStatus, setGenerationStatus] = useState('Initializing autonomous generation...');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const runGenerationLoop = async () => {
      for (let i = quotes.length; i < GENERATION_LIMIT; i++) {
        if (!isMounted.current) {
          setGenerationStatus('Generation paused.');
          return;
        }

        try {
          setGenerationStatus(`[${i + 1}/${GENERATION_LIMIT}] Generating new quote text...`);
          const text = await generateQuoteText();
          
          if (!isMounted.current) break;

          const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
          const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
          
          setGenerationStatus(`[${i + 1}/${GENERATION_LIMIT}] Creating image for "${text.substring(0, 25)}..."`);
          const imageUrl = await generateQuoteImage(text, randomTheme);

          if (!isMounted.current) break;

          addQuote({
            quoteText: text,
            imageUrl: imageUrl,
            category: randomCategory,
          });

        } catch (error) {
          console.error(`Error during generation of quote #${i + 1}:`, error);
          setGenerationStatus(`Error generating quote ${i + 1}. Retrying in 5s...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          i--; // Retry the current iteration after a delay
        }
      }
      if (isMounted.current) {
        setGenerationStatus(`Autonomous generation complete. ${GENERATION_LIMIT} quotes created.`);
      }
    };

    runGenerationLoop();

    return () => {
      isMounted.current = false;
    };
  }, []); // Run only once on mount


  const filteredAndSortedQuotes = useMemo(() => {
    let processedQuotes = [...quotes]; // Create a new array to avoid mutating state

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

  return (
    <div className="container mx-auto">
       <div className="text-center p-4 bg-gray-800 rounded-lg mx-6 mb-4 border border-gray-700">
        <div className="flex items-center justify-center gap-3">
          {generationStatus.includes('complete') || generationStatus.includes('paused') ? 
            <span className="text-green-400">●</span> :
            <Spinner size="sm"/>
          }
          <p className="font-mono text-sm text-gray-300">{generationStatus}</p>
        </div>
      </div>

      <SearchBar 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <QuoteGrid quotes={filteredAndSortedQuotes} likedQuotes={likedQuotes} onLike={toggleLike} />
    </div>
  );
};

export default UserPanel;