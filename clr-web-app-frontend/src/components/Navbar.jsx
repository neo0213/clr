// Navbar.jsx
import React from 'react';
import './Navbar.css';
import { SearchBar } from "./Navbar/SearchBar";
import { SearchResultsList } from "./Navbar/SearchResultsList";
import UserIcon from '../assets/User.png';
import ClrLogo from '../assets/Clr.png';

function Navbar() {
  const [results, setResults] = React.useState([]);

  const handleUserIconClick = () => {
    
  };

  const handleCartClick = () => {
   
  };

  return (
    <div className="Navbar">
      <nav>
        <a href="/" onClick={handleUserIconClick}>
          <img src={ClrLogo} className="title" alt="title" width="70" />
        </a>
        <a href="/" onClick={handleUserIconClick}>
          <img src={UserIcon} className="user" alt="user" width="65" />
        </a>
        
        <div className="search-bar-container">
          <SearchBar setResults={setResults} />
          {results && results.length > 0 && <SearchResultsList results={results} />}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
