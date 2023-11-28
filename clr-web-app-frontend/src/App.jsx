// App.jsx
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from './components/Navbar.jsx';
import ProductList from './hooks/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/cart.jsx';
import { Token } from './Token.jsx';
import  configData from './config.json';



function App() {
  let userId;
  const { accessToken , setAccessToken } = useContext(Token); // Initialize the accessToken Context to be used as a pseudo-global variable

  const {
    error,
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0(); 

  useEffect(() => { // This block of code is for requesting an access token to be used for each request
    const getAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: configData.audience,
          scope: configData.scope,
        });
        setAccessToken(accessToken); // Saves the accessToken as a Context which essentially allows it to be a global variable
      } catch (e) {
        console.log(e.message);
      }
    };
    getAccessToken();
  }, [getAccessTokenSilently]);

  if ( error ) {
    return <div>Oops... {error.message}</div>;
  }

  if ( isLoading ) {
    return <div class="spinner-border mt-5" style={{width: 8 + 'rem', height: 8 + 'rem'}} role="status">
    <span class="visually-hidden">Loading...</span>
  </div>;
  }

  if ( !isAuthenticated ) {
    return loginWithRedirect();
  } else {
    userId = (user.sub).split('|').pop().trim(); // This is how to get the "clean" userId from auth0
    try {
      axios.post('http://localhost:8080/api/v1/user', { // This block of code is for saving the userId on the database if its not there yet
        "userId" : userId
    }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
        }
      });
    } catch (error) {
      console.log('Error saving: ', error);
    }
  }


  const categories = ['Power Tools', 'PPE', 'Welding Machine'];

  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route  path="/" element={categories.map((category) => (
        <ProductList key={category} category={category} userId={userId}/> ))} />
          

          <Route path="/product/:productName" element={<ProductDetail userId={userId}/>} />
          <Route path='/cart' element={<Cart userId={userId}/>}/>
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
