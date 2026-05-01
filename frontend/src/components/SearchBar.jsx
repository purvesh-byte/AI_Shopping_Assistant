import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-bar-container glass-panel">
      <form onSubmit={handleSubmit} className="search-form">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search for products across Amazon, Flipkart, etc..." 
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search Universe
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
