import { useContext } from 'react';
import { QuotesContext } from '../contexts/QuotesContext';

export const useQuotes = () => {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
};
