import React, { createContext, useState, useEffect } from 'react';
import { QuoteContent } from '../types';
import { INITIAL_QUOTES } from '../data/mock';

interface ToastMessage {
  id: number;
  message: string;
}

interface QuotesContextType {
  quotes: QuoteContent[];
  likedQuotes: Set<string>;
  toasts: ToastMessage[];
  addQuote: (newQuoteData: Omit<QuoteContent, 'id' | 'likes' | 'createdAt' | 'authorId'>) => void;
  toggleLike: (quoteId: string) => void;
  removeToast: (id: number) => void;
}

export const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<QuoteContent[]>(INITIAL_QUOTES);
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(() => {
    try {
      const item = window.localStorage.getItem('likedQuotes');
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error(error);
      return new Set();
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem('likedQuotes', JSON.stringify(Array.from(likedQuotes)));
    } catch (error) {
      console.error(error);
    }
  }, [likedQuotes]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const addQuote = (newQuoteData: Omit<QuoteContent, 'id' | 'likes' | 'createdAt' | 'authorId'>) => {
    const newQuote: QuoteContent = {
      ...newQuoteData,
      id: new Date().toISOString() + Math.random(),
      likes: Math.floor(Math.random() * 200), // Give it some initial likes
      createdAt: Date.now(),
      authorId: 'user-ai',
    };
    setQuotes((prevQuotes) => [newQuote, ...prevQuotes]);
    addToast(`New quote created!`);
  };

  const toggleLike = (quoteId: string) => {
    const isLiked = likedQuotes.has(quoteId);
    
    setQuotes(prevQuotes =>
      prevQuotes.map(q => {
        if (q.id === quoteId) {
          return { ...q, likes: isLiked ? q.likes - 1 : q.likes + 1 };
        }
        return q;
      })
    );
    
    setLikedQuotes(prevLiked => {
      const newLiked = new Set(prevLiked);
      if (isLiked) {
        newLiked.delete(quoteId);
      } else {
        newLiked.add(quoteId);
      }
      return newLiked;
    });
  };
  
  return (
    <QuotesContext.Provider value={{ quotes, likedQuotes, toasts, addQuote, toggleLike, removeToast }}>
      {children}
    </QuotesContext.Provider>
  );
};