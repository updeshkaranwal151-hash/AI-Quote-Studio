import React from 'react';
import { CATEGORIES } from '../../types';

interface SearchBarProps {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOption: 'Newest' | 'Most Liked';
    setSortOption: (option: 'Newest' | 'Most Liked') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    activeCategory, setActiveCategory, searchTerm, setSearchTerm, sortOption, setSortOption 
}) => {
  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 border-t border-b border-gray-800 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {allCategories.map((category) => (
              <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                      activeCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                  {category}
              </button>
          ))}
      </div>
      <div className="flex-grow w-full sm:w-auto"></div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <input 
            type="search" 
            placeholder="Search quotes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-48 p-2 bg-gray-700 rounded-full text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 transition px-4 text-sm"
        />
        <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value as 'Newest' | 'Most Liked')}
            className="p-2 bg-gray-700 rounded-full text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 transition text-sm"
        >
            <option>Newest</option>
            <option>Most Liked</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
