import React, { useState, useRef, useEffect } from 'react';
import { QuoteContent } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useQuotes } from '../../hooks/useQuotes';

interface QuoteDetailModalProps {
  quote: QuoteContent;
  isLiked: boolean;
  onLike: (id: string) => void;
  onClose: () => void;
  onAuthorClick: (authorId: string) => void;
}

const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({ quote, isLiked, onLike, onClose, onAuthorClick }) => {
  const { currentUser, users } = useAuth();
  const { comments, addComment } = useQuotes();
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const author = users[quote.authorId] || { name: 'Unknown', avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=unknown` };
  const quoteComments = comments[quote.id] || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser) {
      addComment(quote.id, newComment.trim(), currentUser.id);
      setNewComment('');
    }
  };

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [quoteComments]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" role="dialog" aria-modal="true">
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img src={quote.imageUrl} alt={quote.quoteText} className="w-full h-full object-cover" />
           <p className="absolute bottom-4 left-4 right-4 bg-black/50 text-white text-center font-serif italic text-lg p-3 rounded-md backdrop-blur-sm">
            "{quote.quoteText}"
          </p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col p-6">
          <div className="flex justify-between items-start">
            <div>
              <button onClick={() => onAuthorClick(quote.authorId)} className="flex items-center gap-3 group mb-2">
                <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-blue-500 transition" />
                <div>
                  <h3 className="font-bold text-white text-lg">{author.name}</h3>
                  <p className="text-sm text-gray-400">@{author.name.toLowerCase().replace(' ', '')}</p>
                </div>
              </button>
              <span className="bg-gray-700 text-blue-400 text-xs font-bold py-1 px-2 rounded-full">{quote.category}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
          </div>
          <div className="border-t border-gray-700 my-4"></div>
          
          <h4 className="text-lg font-semibold text-white mb-2">Comments ({quoteComments.length})</h4>
          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {quoteComments.length > 0 ? (
                quoteComments.map(comment => {
                    const commentAuthor = users[comment.authorId] || { name: 'Unknown', avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=unknown` };
                    return (
                        <div key={comment.id} className="flex items-start gap-3">
                            <img src={commentAuthor.avatar} alt={commentAuthor.name} className="w-10 h-10 rounded-full mt-1"/>
                            <div>
                                <p className="font-semibold text-white">{commentAuthor.name}</p>
                                <p className="text-gray-300">{comment.text}</p>
                            </div>
                        </div>
                    )
                })
            ) : (
                <p className="text-gray-500 text-center py-8">Be the first to comment!</p>
            )}
             <div ref={commentsEndRef} />
          </div>

          <div className="border-t border-gray-700 mt-4 pt-4">
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <img src={currentUser?.avatar} alt="Your avatar" className="w-10 h-10 rounded-full"/>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 bg-gray-700 rounded-full text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 px-4"
              />
              <button type="submit" className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 disabled:bg-gray-500" disabled={!newComment.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuoteDetailModal;
