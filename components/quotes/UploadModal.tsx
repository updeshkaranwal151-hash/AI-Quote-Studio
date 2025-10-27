import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../../types';
import { useQuotes } from '../../hooks/useQuotes';
import { useAuth } from '../../hooks/useAuth';
import { fileToBase64 } from '../../utils/helpers';
import Spinner from '../common/Spinner';
import PrivacyPolicy from '../common/PrivacyPolicy';

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  const [quoteText, setQuoteText] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addQuote } = useQuotes();
  const { currentUser } = useAuth();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image size should be less than 4MB.');
        return;
      }
      setError('');
      setImageFile(file);
      const { base64, mimeType } = await fileToBase64(file);
      setImagePreview(`data:${mimeType};base64,${base64}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim() || !imageFile || !currentUser) {
      setError('Please fill in all fields and upload an image.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const imageUrl = `data:${mimeType};base64,${base64}`;

      addQuote({
        quoteText: quoteText.trim(),
        imageUrl: imageUrl,
        category: category,
        authorId: currentUser.id,
      });

      onClose();
    } catch (err) {
      console.error("Error creating quote:", err);
      setError("Failed to create quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up" role="dialog" aria-modal="true">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Create a New Quote</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="quoteText" className="block text-sm font-medium text-gray-300 mb-1">Quote Text</label>
              <textarea
                id="quoteText"
                rows={3}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="The journey of a thousand miles begins with a single step."
                className="w-full p-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Background Image</label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md object-contain" />
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  <div className="flex text-sm text-gray-400">
                    <p className="pl-1">{imageFile ? imageFile.name : "Upload a file or drag and drop"}</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB</p>
                </div>
              </div>
              <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
            </div>

            <PrivacyPolicy />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end items-center gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 flex items-center gap-2"
              >
                {isLoading && <Spinner size="sm" />}
                {isLoading ? 'Creating...' : 'Create Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
