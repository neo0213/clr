import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {

  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0(); 

    return (
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
            <div className="d-flex">
                <a href="/cart"><img className="me-4" width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/shopping-cart--v1.png" alt="shopping-cart--v1"/></a>
                {!isAuthenticated ? (
                  <button onClick={() => loginWithRedirect()}>Login</button>
                ) : (
                  <button onClick={() => logout()}>Logout</button> 
                )}
            </div>

        </div>

        </>
    );

}

export default Navbar
