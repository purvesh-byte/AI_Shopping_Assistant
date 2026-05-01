import React, { useState } from 'react';
import ComparisonDashboard from './components/ComparisonDashboard';
import SearchBar from './components/SearchBar';
import ChatAssistant from './components/ChatAssistant';
import './index.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-container">
      <header>
        <h1>AI Shopping Assistant</h1>
        <p>Intelligent, fast, and personalized product comparisons</p>
      </header>
      
      <SearchBar onSearch={setSearchQuery} />

      <main>
        <ComparisonDashboard searchQuery={searchQuery} />
      </main>
      
      <ChatAssistant />
    </div>
  );
}

export default App;
