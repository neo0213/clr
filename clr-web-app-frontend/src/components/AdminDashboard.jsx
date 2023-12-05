import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Token } from '../Token'; 
import { useAuth0 } from '@auth0/auth0-react';
import configData from '../config.json';


const ProductForm = ({ userId }) => {
    let { accessToken, setAccessToken } = useContext(Token);
  const [formData, setFormData] = useState({
    prodName: '',
    img: '',
    price: '',
    category: '',
  });

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

        const response = await axios.get('http://localhost:8080/api/v1/user', {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = await getAccessTokenSilently({
        audience: configData.audience,
        scope: configData.scope,
      });
  
      // Send the product data to the specified endpoint
      const response = await axios.post(
        'http://localhost:8080/api/v1/products/add',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Product added successfully:', response.data);
      // You can handle success or redirection logic here
    } catch (error) {
      console.error('Error adding product:', error.message);
      // You can handle error messages or redirect to an error page here
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="prodName" className="form-label">
            Product Name:
          </label>
          <input
            type="text"
            id="prodName"
            name="prodName"
            value={formData.prodName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="img" className="form-label">
            Image URL:
          </label>
          <input
            type="text"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category:
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
