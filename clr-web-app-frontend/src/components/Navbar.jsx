// Navbar.jsx
import { useState } from 'react';
import './Navbar.css';
import { SearchBar } from "./Navbar/SearchBar";
import { SearchResultsList } from "./Navbar/SearchResultsList";
import CartImage from '../assets/Cart.png';
import UserIcon from '../assets/User.png';

function Navbar() {
    const [results, setResults] = useState([]);
    const [isLoggedIn, setLoggedIn] = useState(false);
  
    const handleLogin = () => {

      setLoggedIn(!isLoggedIn);
    };
  
    const handleUserIconClick = () => {
      if (isLoggedIn) {

        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
          setLoggedIn(false);
        }
      } else {

      }
    };
  
    const handleCartClick = () => {

      if (!isLoggedIn) {

      }
    };
  
    return (
      <div className="Navbar">
        <nav>
          <a href="/">
            <img src="./src\assets/Clr.png" className="title" alt="title" width="70" />
          </a>
          {isLoggedIn ? (
            <>
              <a href="/" onClick={handleUserIconClick}>
                <img src={UserIcon} className="user" alt="user" width="65" />
              </a>
              <a href="/" onClick={handleCartClick}>
                <img src={CartImage} className="cart" alt="cart" width="65" />
              </a>
            </>
          ) : (
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
          )}
  
          <div className="search-bar-container">
            <SearchBar setResults={setResults} />
            {results && results.length > 0 && <SearchResultsList results={results} />}
          </div>
        </nav>
      </div>
    );
  }
//Old Navbar code
/*
       <>
        <div className="container d-flex justify-content-between align-items-center">

             <a href="/" className="h1">Clr</a>
             <div class="search-container">
                <input className="p-3 search-bar" type="text" placeholder="Search for an item" />
                <span class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                <path d="M21 21l-6 -6"></path>
                </svg></span>
            </div>
             <div>Profile</div>
        </div>

        </>
*/
  
  export default Navbar;
