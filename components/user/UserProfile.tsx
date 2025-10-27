import React, { useState, useMemo, useEffect } from 'react';
import { useQuotes } from '../../hooks/useQuotes';
import { useAuth } from '../../hooks/useAuth';
import QuoteGrid from '../quotes/QuoteGrid';
import QuoteDetailModal from '../quotes/QuoteDetailModal';
import { QuoteContent } from '../../types';
import { View } from '../../App';
import ConfirmationModal from '../common/ConfirmationModal';

interface UserProfileProps {
  userId: string;
  setView: (view: View) => void;
}

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-gray-400 text-sm">{title}</p>
    </div>
);

const UserProfile: React.FC<UserProfileProps> = ({ userId, setView }) => {
  const { quotes, likedQuotes, toggleLike, deleteQuote, deleteQuotesByAuthor } = useQuotes();
  const { currentUser, users, updateUser, deleteUser } = useAuth();
  
  const [selectedQuote, setSelectedQuote] = useState<QuoteContent | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [confirmAction, setConfirmAction] = useState<{type: 'quote' | 'account', id?: string} | null>(null);

  const user = users[userId];
  const isCurrentUserProfile = currentUser?.id === userId;

  useEffect(() => {
    if (user) {
      setBioText(user.bio || '');
    }
  }, [user]);
  
  const userQuotes = useMemo(() => {
    return quotes
      .filter(quote => quote.authorId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [quotes, userId]);

  const totalLikesReceived = useMemo(() => {
    return userQuotes.reduce((sum, quote) => sum + quote.likes, 0);
  }, [userQuotes]);
  
  if (!user) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl text-gray-400">User not found.</h2>
        <button onClick={() => setView({ page: 'gallery' })} className="mt-4 text-blue-400 hover:underline">
          Back to Gallery
        </button>
      </div>
    );
  }

  const handleAuthorClick = (authorId: string) => {
    setSelectedQuote(null);
    if(authorId !== userId) {
        setView({ page: 'profile', userId: authorId });
    }
  };

  const handleSaveBio = () => {
    updateUser(userId, { bio: bioText });
    setIsEditingBio(false);
  };
  
  const handleDeleteQuote = (quoteId: string) => {
    setConfirmAction({ type: 'quote', id: quoteId });
  };
  
  const handleDeleteAccount = () => {
    setConfirmAction({ type: 'account' });
  };
  
  const handleConfirm = () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === 'quote' && confirmAction.id) {
        deleteQuote(confirmAction.id);
    } else if (confirmAction.type === 'account') {
        deleteQuotesByAuthor(userId);
        deleteUser(userId);
        // App will rerender login modal as currentUser is now null
    }
    setConfirmAction(null);
  };

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 animate-fade-in-up">
        <div className="flex flex-col items-center gap-4 mb-8">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-blue-500" />
            <h2 className="text-4xl font-bold text-white">{user.name}</h2>
            {isEditingBio ? (
                <div className="w-full max-w-md">
                    <textarea 
                        value={bioText} 
                        onChange={(e) => setBioText(e.target.value)} 
                        className="w-full p-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                        rows={3}
                    />
                    <div className="flex justify-center gap-2 mt-2">
                        <button onClick={handleSaveBio} className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-md">Save</button>
                        <button onClick={() => setIsEditingBio(false)} className="px-4 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-md">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-400 max-w-md">{user.bio || 'No bio yet.'}</p>
                    {isCurrentUserProfile && (
                        <button onClick={() => setIsEditingBio(true)} className="text-sm text-blue-400 hover:underline mt-1">
                            Edit Bio
                        </button>
                    )}
                </div>
            )}
             <button onClick={() => setView({ page: 'gallery' })} className="text-sm text-blue-400 hover:underline mt-2">
                &larr; Back to Gallery
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto mb-8">
            <StatCard title="Quotes Created" value={userQuotes.length} />
            <StatCard title="Likes Received" value={totalLikesReceived} />
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">Quotes by {user.name}</h3>

        <QuoteGrid 
            quotes={userQuotes} 
            likedQuotes={likedQuotes} 
            onLike={toggleLike} 
            onCardClick={setSelectedQuote}
            onAuthorClick={handleAuthorClick}
            showDelete={isCurrentUserProfile}
            onDelete={handleDeleteQuote}
        />
        
        {isCurrentUserProfile && (
            <div className="mt-12 p-6 border-t border-red-500/30 text-center">
                <h4 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h4>
                <p className="text-gray-400 mb-4 max-w-md mx-auto">Deleting your account is permanent. All of your quotes and data will be removed.</p>
                <button onClick={handleDeleteAccount} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">
                    Delete My Account
                </button>
            </div>
        )}
      </div>
      {selectedQuote && (
        <QuoteDetailModal
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
            onAuthorClick={handleAuthorClick}
            isLiked={likedQuotes.has(selectedQuote.id)}
            onLike={toggleLike}
        />
      )}
      <ConfirmationModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction?.type === 'account' ? 'Delete Account' : 'Delete Quote'}
        message={`Are you sure you want to permanently delete this ${confirmAction?.type}? This action cannot be undone.`}
      />
    </>
  );
};

export default UserProfile;
