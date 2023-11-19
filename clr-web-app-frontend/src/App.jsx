// App.jsx
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from './components/Navbar.jsx';
import ProductList from './hooks/ProductList';
import ProductDetail from './components/ProductDetail';
import { Token } from '../Token.jsx';



function App() {
  const { accessToken, setAccessToken } = useContext(Token);

  const {
    error,
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0(); 

  const getAccessToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'https://dev-k5h56p77fu76lhif.us.auth0.com/api/v2/',
        scope: 'read:current_user'
      });
      setAccessToken(accessToken);
    } catch (e) {
      console.log(e.message);
    }
  };

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading ) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return loginWithRedirect();
  }

  if (accessToken == null){
    getAccessToken();
    while (accessToken == null){
      return <div>Loading...</div>
    }
  }

  const categories = ['Power Tools', 'PPE', 'Welding Machine'];

  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route  path="/" element={categories.map((category) => (
        <ProductList key={category} category={category}/>))} />
          

          <Route path="/product/:productName" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
