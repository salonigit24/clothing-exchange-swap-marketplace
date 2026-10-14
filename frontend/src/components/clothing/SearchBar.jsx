import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search by clothing name, brand, category...' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-earth-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 bg-white rounded-2xl border border-earth-200 text-earth-800 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm shadow-sm transition"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 p-1 text-earth-400 hover:text-earth-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
