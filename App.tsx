import React from 'react';
import Header from './components/layout/Header';
import UserPanel from './components/user/UserPanel';
import Toast from './components/common/Toast';
import { useQuotes } from './hooks/useQuotes';
import { QuotesProvider } from './contexts/QuotesContext';
import Footer from './components/layout/Footer';

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useQuotes();

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <Header />
      <main className="py-8 flex-grow">
        <UserPanel />
      </main>
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QuotesProvider>
      <AppContent />
    </QuotesProvider>
  );
};

export default App;