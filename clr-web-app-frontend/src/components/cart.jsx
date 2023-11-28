import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Token } from '../Token.jsx';

function Cart({ userId }) {
  const [products, setProducts] = useState([]);
  const { accessToken } = useContext(Token);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`,
          }
        });

        setProducts(response.data.cart);
      } catch (error) {
        console.log('Error fetching cart: ', error);
      }
    };

    fetchCart();
  }, [userId, accessToken]);

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

  return (
    <>
      <h1 className='text-start mt-5'>My Cart</h1>
      <div className='list-group mt-4'>
        {products.map((product) => (
          <div className='list-group-item d-flex flex-start align-items-center' key={product.id}>
            <img className='me-5' src={product.img} alt={product.prodName} style={{ maxWidth: '100px' }} />
            <span className=''>{product.prodName}</span>
            <button
              className='ms-auto btn btn-danger'
              onClick={() => handleRemoveFromCart(product.id)}
            >
              <img width="15" height="15" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/filled-trash.png" alt="filled-trash"/>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Cart;
