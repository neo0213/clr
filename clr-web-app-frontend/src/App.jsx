// App.jsx
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProductList from './hooks/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/cart.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import { Token } from './Token.jsx';
import  configData from './config.json';


function App() {
  let { setAccessToken } = useContext(Token);
  let userId;
  const {
    user,
    getAccessTokenSilently
  } = useAuth0();
  try {
    userId = (user.sub).split('|').pop().trim();
  } catch (error) {
    console.log("Must login first:",error.message);
  }

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
