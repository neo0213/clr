// App.jsx
import React, { useEffect, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ProductList from './hooks/ProductList';
import { Token } from './Token.jsx';
import  configData from './config.json';



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
      <div>
        {categories.map((category) => (
        <ProductList key={category} category={category}/>))}
      </div>
    </>
  );
}

export default App;
