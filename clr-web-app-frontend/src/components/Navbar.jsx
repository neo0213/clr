import { useState } from 'react';
import './Navbar.css';
import { SearchBar } from "./Navbar/SearchBar";
import { SearchResultsList } from "./Navbar/SearchResultsList";

function Navbar() {

 const [results, setResults] = useState([]);

 return (
    <div className="Navbar">
        <nav>
            <a href="/">
                <img src="./src\assets/Clr.png" className="title" alt="title" width="70"/>
            </a>
            <a href="/">
                <img src="/src\assets/A.png" className="user" alt="user" width="65"/>
            </a>
            <a href="/">
                <svg xmlns="http://www.w3.org/2000/svg" className="cart" viewBox="0 0 24 24" width="24" height="24">
                <path d="M3 3h2v2m12-2h6v2h-6zM3 7h18l2 10.71a1 1 0 0 1-1 .92H4a1 1 0 0 1-1-.92L2 7zM6 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm12 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4-14V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
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
