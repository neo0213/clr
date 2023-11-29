import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Token } from '../Token.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import  configData from '../config.json';
import Message from './Message.jsx';


function Cart({ userId }) {
  const [products, setProducts] = useState([]);
  let { accessToken, setAccessToken } = useContext(Token);
  const [quoteMessage, setQuoteMessage] = useState("");

  function openMessageModal(message) {
    setQuoteMessage(message);
    setIsOpen(true);
  }

  
  const {
    error,
    isLoading,
    isAuthenticated,
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
    try {
      axios.post('http://localhost:8080/api/v1/user', { // This block of code is for saving the userId on the database if its not there yet
        "userId" : userId
    }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
        }
      }); 
      try {
        axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`,
          }
        }).then(function(response){
          setProducts(response.data.cart);
        })
      } catch (error) {
        console.log('Error fetching cart: ', error);
      }
    } catch (error) {
      console.log('Error saving: ', error);
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/cart/${userId}`,{
        productsToRemove: [productId]
      }, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      // Update the products list after successful removal
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.log('Error removing item from cart: ', error);
    }
  };

  let productList = [];
  let concatenatedProductNames;
  const sendQuote = async () => {
    let productList = [];
    let concatenatedProductNames;
  
    if (products && Array.isArray(products)) {
      products.forEach((product) => {
        productList.push(product.prodName);
      });
      concatenatedProductNames = productList.join(' ');
    }
  
    openMessageModal(concatenatedProductNames);
  };
  
  

  return (
    <>
      <h1 className='text-start mt-5'>My Cart</h1>
      <div className='list-group mt-4'>
        {products.map((product) => (
          <a href={'/product/'+product.prodName} className='list-group-item list-group-item-action d-flex flex-start align-items-center' key={product.id}>
            <img className='me-5' src={product.img} alt={product.prodName} style={{ maxWidth: '100px' }} />
            <span className=''>{product.prodName}</span>
            <button
              className='ms-auto btn btn-danger' onClick={() => handleRemoveFromCart(product.id)}
            >
              <img width="15" height="15" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/filled-trash.png" alt="filled-trash"/>
            </button>
          </a>
        ))}
      </div>

      <button className='mt-5' onClick={() => { sendQuote()}}>Get a Quote</button>
    </>
  );
}

export default Cart;
