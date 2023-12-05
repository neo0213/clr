import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Token } from '../Token.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import configData from '../config.json';

const Orders = ({ userId }) => {
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

  const [cartData, setCartData] = useState({
    cart: {},
    pending: [],
    checkout: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: configData.audience,
          scope: configData.scope,
        });

        setAccessToken(token);

        const response = await axios.post('http://localhost:8080/api/v1/user', {
          userId: userId,
        }, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        });

        setCartData(response.data);
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

  
  const renderOrderDetails = (order) => {
    return (
      <div key={order.orderId} className="mt-3">
        <div>
          <strong>Order ID:</strong> {order.orderId}
        </div>
        <div>
          <strong>Created At:</strong> {order.createdAt}
        </div>
        <div>
          <strong>Address:</strong> {order.address}
        </div>
        <div>
          <strong>Shipping Fee:</strong> ₱{order.shippingFee}
        </div>
        <div>
          <strong>Total Price:</strong> ₱{order.totalPrice}
        </div>
        <div className="mt-2">
          <strong>Items:</strong>
          {order.items.map(item => (
            <div key={item.product.id} className="row">
              <span className='text-wrap col-4 my-2'>{item.product.prodName}</span>
              <span className='text-wrap col-4 my-2'>Quantity: {item.quantity}</span>
              <span className='text-wrap col-4 my-2'>Price: ₱{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className='text-start mt-5'>My Orders</h1>
      <div className='list-group mt-4'>
        {Object.values(cartData.pending).map((order) => (
          <Dropdown key={order.orderId} className='list-group-item list-group-item-action d-flex flex-start align-items-center'>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {order.orderId} - {order.createdAt}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>{renderOrderDetails(order)}</Dropdown.Item>
            </Dropdown.Menu>
            <div className='ms-auto'>
              <span>Processing</span>
            </div>
          </Dropdown>
        ))}
        {Object.values(cartData.checkout).map((order) => (
          <Dropdown key={order.orderId} className='list-group-item list-group-item-action d-flex flex-start align-items-center'>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {order.orderId} - {order.createdAt}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>{renderOrderDetails(order)}</Dropdown.Item>
            </Dropdown.Menu>
            <div className='ms-auto'>
              <span>Approved</span>
            </div>
          </Dropdown>
        ))}
        {(!Object.values(cartData.pending).length && !Object.values(cartData.checkout).length) && 'You have no orders'}
      </div>
    </div>
  );
};

export default Orders;
