//Navbar.jsx
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


            <div className="search-bar-container">
                <SearchBar setResults={setResults} />
                {results && results.length > 0 && <SearchResultsList results={results} />}
            </div>
        </nav>
    </div>
 );
}

export default Navbar;
