import { Token } from '../Token.jsx';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import  configData from '../config.json';

const Checkout = ({userId}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provinceList, setProvinceList] = useState([]);
  let { accessToken, setAccessToken } = useContext(Token);
  const [selectedProvince, setSelectedProvince] = useState("");

  const {
    error,
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0(); 

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://isaacdarcilla.github.io/philippine-addresses/province.json"
        );
        const data = await response.json();
        setProvinceList(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

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

  return (
    <div>
      <div className='list-group mt-4'>
        <h2 className='my-3'>Checkout</h2>
        {products.map((product) => (
          <a href={'/product/'+product.prodName} className='list-group-item list-group-item-action d-flex flex-start align-items-center' key={product.id}>
            <img className='me-5' src={product.img} alt={product.prodName} style={{ maxWidth: '100px' }} />
            <span className=''>{product.prodName}</span>
          </a>
        ))}
      </div>
      <label className='me-2 mt-5'>Select Province:</label>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <select className='checkout'
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          <option value="" disabled>
            Select a province
          </option>
          {provinceList.map((province) => (
            <option value={province.province_code}>
              {province.province_name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Checkout;
