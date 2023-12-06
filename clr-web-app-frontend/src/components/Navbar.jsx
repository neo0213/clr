import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {

  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user
  } = useAuth0(); 

  let userIdnav;

  try {
    userIdnav = (user.sub).split('|').pop().trim();
    console.log(userIdnav);
  } catch (error) {
    console.log("Must login first:",error.message);
  }


    return (
        <>
        <div className="container d-flex justify-content-between align-items-center">

             <a href="/" className="h1">CLR</a>
            <div className="d-flex justify-content-center align-items-center">
                {userIdnav == '656f279d8117da0d8b51e41b' ? (<a className="me-4 text-black text-bold" href="/Admin-Dashboard">Dashboard</a>) : ('')}
                <a href="/cart"><img className="me-4" width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/shopping-cart--v1.png" alt="shopping-cart--v1"/></a>
                <a href="/orders"><img className="me-4"width="30" height="30" src="https://img.icons8.com/ios/50/shopping-bag--v1.png" alt="shopping-bag--v1"/></a>
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
