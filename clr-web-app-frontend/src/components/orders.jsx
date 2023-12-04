import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Token } from '../Token.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import  configData from '../config.json';


const APP_ID = "FAF0A502-9C9E-47EB-94B2-4279F4AEFB7E";

function Orders({ userId, channelUrl, setChannelUrl, groupChannel, sb }) {
  const [products, setProducts] = useState([]);
  let { accessToken, setAccessToken } = useContext(Token);
  const [quoteMessage, setQuoteMessage] = useState("");
  const [cartData, setCartData] = useState({
    cart: {},
    pending: [],
    checkout: {}
  });

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

        setCartData(response.data);

        const prodInfo = response.data.checkout.items.map(item => {
          return item.product;
        });

        const orderedProds = Object.entries(response.data.checkout.items);
        console.log("Ordered Products:", orderedProds);

        setProducts(prodInfo);

        
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
  

  

  return (
    <>
      <h1 className='text-start mt-5'>My Orders</h1>
      <div className='list-group mt-4'>
        {products ? products.map((order) => (
          <a href={'/product/'+order.prodName} className='list-group-item list-group-item-action d-flex flex-start align-items-center'>
            <img className='me-5' src={order.img} alt={order.prodName} style={{ maxWidth: '100px' }} />
            <span className=''>{order.prodName}</span>
            <div className='ms-auto'>
            Processing
            </div>
          </a>
        )) : 'You have empty cart' }
      </div>

    </>
  );
}

export default Orders;
