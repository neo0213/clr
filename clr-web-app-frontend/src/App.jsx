// App.jsx
import React, { useEffect, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Token } from './Token.jsx';
import  configData from './config.json';

// Components
import Navbar from './components/Navbar.jsx';

// Routing
import { Routes, Route } from "react-router-dom";

// Routes
import ProductList from './routes/ProductList.jsx';
import ProductDetail from "./routes/ProductDetail.jsx";
import Messages from './routes/Messages.jsx';
import { ShoppingCart } from './components/ShoppingCart.jsx';

function App() {
  const { setAccessToken } = useContext(Token);

  const {
    error,
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0(); 

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: configData.audience,
          scope: configData.scope,
        });
        setAccessToken(accessToken);
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
    return <div>Loading...</div>;
  }

  if ( !isAuthenticated ) {
    return loginWithRedirect();
  } else {
    let str = user.sub;
    // let userId = str.replace('|','-')
    let userId = str.split('|').pop().trim();
    console.log(user.name)
  }

  const categories = ['Power Tools', 'PPE', 'Welding Machine'];

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={
            categories.map((category) => (<ProductList key={category} category={category}/>))
            } />
          <Route path='/product/:productName' element={<ProductDetail />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/cart' element={<ShoppingCart />} />
        </Routes>
        
      </div>
    </>
  );
}

export default App;
