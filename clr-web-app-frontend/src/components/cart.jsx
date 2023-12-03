import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Token } from '../Token.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import  configData from '../config.json';


const APP_ID = "FAF0A502-9C9E-47EB-94B2-4279F4AEFB7E";

function Cart({ userId, channelUrl, setChannelUrl, groupChannel, sb }) {
  const [products, setProducts] = useState([]);
  let { accessToken, setAccessToken } = useContext(Token);
  const [quoteMessage, setQuoteMessage] = useState("");


  const {
    error,
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: configData.audience,
          scope: configData.scope,
        });

        setAccessToken(token);

        const response = await axios.post('http://localhost:8080/api/v1/user', {
          "userId": userId
        }, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        });

        setProducts(response.data.cart);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [getAccessTokenSilently, setAccessToken, userId]);

  
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  
  if (isLoading) {
    return (
      <div className="spinner-border mt-5" style={{ width: 8 + 'rem', height: 8 + 'rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return loginWithRedirect();
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

 // ... (previous imports)

const sendQuote = async () => {
  try {
    let productList = [];
    let concatenatedProductNames;

    if (products && Array.isArray(products)) {
      products.forEach((product) => {
        productList.push(product.prodName);
      });
      concatenatedProductNames = productList.join(' ');
    }

    await sendQuoteToChannel(groupChannel, channelUrl, concatenatedProductNames);
    
  } catch (error) {
    console.error('Error sending quote to Sendbird:', error);
  }
};

const sendQuoteToChannel = async (groupChannel, channelUrl, concatenatedProductNames) => {

  const messageParams = new sb.UserMessageParams();
          messageParams.message = concatenatedProductNames;
          groupChannel.sendUserMessage(messageParams, (message, error) => {
            if (error) {
              console.error("SendBird Message Sending Failed:", error);
            } else {
              console.log("Message sent successfully:", message);
            }
    });
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
