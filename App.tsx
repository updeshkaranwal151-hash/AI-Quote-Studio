import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import UserPanel from './components/user/UserPanel';
import AdminPanel from './components/admin/AdminPanel';
import Toast from './components/common/Toast';
import { useQuotes } from './hooks/useQuotes';
import { QuotesProvider } from './contexts/QuotesContext';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import PasswordModal from './components/auth/PasswordModal';
import UserProfile from './components/user/UserProfile';

export type View = {
  page: 'gallery' | 'dashboard' | 'profile';
  userId?: string;
};

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useQuotes();
  const authContext = React.useContext(AuthContext);
  const [view, setView] = useState<View>({ page: 'gallery' });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem('isAdminAuthenticated') === 'true';
    } catch (e) {
      console.error("Could not access session storage", e);
      return false;
    }
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('isAdminAuthenticated', String(isAdminAuthenticated));
    } catch (e) {
      console.error("Could not access session storage", e);
    }
  }, [isAdminAuthenticated]);

  if (!authContext?.currentUser) {
    return <LoginModal />;
  }

  const handleTabClick = (page: 'gallery' | 'dashboard') => {
    if (page === 'dashboard' && !isAdminAuthenticated) {
      setIsPasswordModalOpen(true);
    } else {
      setView({ page });
    }
  };

  const handlePasswordSuccess = () => {
    setIsAdminAuthenticated(true);
    setView({ page: 'dashboard' });
    setIsPasswordModalOpen(false);
  };

  const renderContent = () => {
    switch(view.page) {
      case 'gallery':
        return <UserPanel setView={setView} />;
      case 'dashboard':
        return isAdminAuthenticated ? <AdminPanel /> : null;
      case 'profile':
        return view.userId ? <UserProfile userId={view.userId} setView={setView} /> : <UserPanel setView={setView} />;
      default:
        return <UserPanel setView={setView} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <Header setView={setView} />
      <nav className="bg-gray-800/80 backdrop-blur-sm sticky top-[69px] z-30 border-b border-t border-gray-700">
        <div className="container mx-auto px-4 flex">
            <TabButton 
                label="Quote Gallery" 
                isActive={view.page === 'gallery' || view.page === 'profile'} 
                onClick={() => handleTabClick('gallery')} 
            />
            <TabButton 
                label="Admin Dashboard" 
                isActive={view.page === 'dashboard'} 
                onClick={() => handleTabClick('dashboard')} 
            />
        </div>
      </nav>
      <main className="py-8 flex-grow">
        {renderContent()}
      </main>
      
      {isPasswordModalOpen && (
        <PasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={handlePasswordSuccess}
        />
      )}
      
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <Footer />
    </div>
  );
};

const TabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-3 font-semibold text-sm transition-colors ${
            isActive 
            ? 'text-white border-b-2 border-blue-500' 
            : 'text-gray-400 hover:text-white'
        }`}
    >
        {label}
    </button>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuotesProvider>
        <AppContent />
      </QuotesProvider>
    </AuthProvider>
  );
};

export default App;
