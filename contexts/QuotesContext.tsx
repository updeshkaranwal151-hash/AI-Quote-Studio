import React, { createContext, useState, useEffect } from 'react';
import { QuoteContent, Comment } from '../types';
import { INITIAL_QUOTES } from '../data/mock';

interface ToastMessage {
  id: number;
  message: string;
}

interface QuotesContextType {
  quotes: QuoteContent[];
  likedQuotes: Set<string>;
  toasts: ToastMessage[];
  comments: Record<string, Comment[]>;
  addQuote: (newQuoteData: Omit<QuoteContent, 'id' | 'likes' | 'createdAt'>) => void;
  toggleLike: (quoteId: string) => void;
  removeToast: (id: number) => void;
  addComment: (quoteId: string, text: string, authorId: string) => void;
  deleteQuote: (quoteId: string) => void;
  deleteQuotesByAuthor: (authorId: string) => void;
}

export const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<QuoteContent[]>(() => {
    try {
      const storedQuotes = window.localStorage.getItem('quotes');
      return storedQuotes ? JSON.parse(storedQuotes) : INITIAL_QUOTES;
    } catch (error) {
      console.error(error);
      return INITIAL_QUOTES;
    }
  });

  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(() => {
    try {
      const item = window.localStorage.getItem('likedQuotes');
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error(error);
      return new Set();
    }
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    try {
      const storedComments = window.localStorage.getItem('comments');
      return storedComments ? JSON.parse(storedComments) : {};
    } catch (error) {
      console.error(error);
      return {};
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (error) {
      console.error(error);
    }
  }, [quotes]);

  useEffect(() => {
    try {
      window.localStorage.setItem('likedQuotes', JSON.stringify(Array.from(likedQuotes)));
    } catch (error) {
      console.error(error);
    }
  }, [likedQuotes]);

  useEffect(() => {
    try {
      window.localStorage.setItem('comments', JSON.stringify(comments));
    } catch (error) {
      console.error(error);
    }
  }, [comments]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const addQuote = (newQuoteData: Omit<QuoteContent, 'id' | 'likes' | 'createdAt'>) => {
    const newQuote: QuoteContent = {
      ...newQuoteData,
      id: new Date().toISOString() + Math.random(),
      likes: 0,
      createdAt: Date.now(),
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

  const addComment = (quoteId: string, text: string, authorId: string) => {
    const newComment: Comment = {
      id: new Date().toISOString() + Math.random(),
      authorId,
      text,
      createdAt: Date.now(),
    };
    setComments((prevComments) => ({
      ...prevComments,
      [quoteId]: [...(prevComments[quoteId] || []), newComment],
    }));
    addToast('Comment posted!');
  };

  const deleteQuote = (quoteId: string) => {
    setQuotes(prev => prev.filter(q => q.id !== quoteId));
    setLikedQuotes(prev => {
        const newLiked = new Set(prev);
        newLiked.delete(quoteId);
        return newLiked;
    });
    setComments(prev => {
        const newComments = { ...prev };
        delete newComments[quoteId];
        return newComments;
    });
    addToast('Quote deleted successfully.');
  };

  const deleteQuotesByAuthor = (authorId: string) => {
    const quotesToDelete = quotes.filter(q => q.authorId === authorId);
    const quoteIdsToDelete = new Set(quotesToDelete.map(q => q.id));

    setQuotes(prev => prev.filter(q => q.authorId !== authorId));
    
    setLikedQuotes(prev => {
        const newLiked = new Set(prev);
        quoteIdsToDelete.forEach(id => newLiked.delete(id));
        return newLiked;
    });

    // Fix: Rebuild the comments object to avoid issues with the delete operator in a loop.
    setComments(prev => {
        const newEntries = Object.entries(prev).filter(([id]) => !quoteIdsToDelete.has(id));
        return Object.fromEntries(newEntries);
    });
  };
  
  return (
    <QuotesContext.Provider value={{ quotes, likedQuotes, toasts, comments, addQuote, toggleLike, removeToast, addComment, deleteQuote, deleteQuotesByAuthor }}>
      {children}
    </QuotesContext.Provider>
  );
};
