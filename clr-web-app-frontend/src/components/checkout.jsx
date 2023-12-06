import { Token } from '../Token.jsx';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import configData from '../config.json';
import { regions, provinces, cities, barangays, regionByCode, provincesByCode, provinceByName } from "select-philippines-address";

const Checkout = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [cartData, setCartData] = useState({
    cart: {},
    pending: [],
    checkout: {}
  });

  const { accessToken, setAccessToken } = useContext(Token);

  const {
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await regions();
        setRegionList(regionsData || []); // Ensure regionsData is an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching regions: ', error);
      }
    };
  
    fetchRegions();
  }, []);

  const handleRegionChange = async (regionCode) => {
    setSelectedRegion(regionCode);

    // Fetch provinces for the selected region
    const provinceData = await provinces(regionCode);
    setProvinceList(provinceData);

    // Reset city and barangay lists
    setCityList([]);
    setBarangayList([]);
  };

  const handleProvinceChange = async (provinceCode) => {
    setSelectedProvince(provinceCode);

    // Fetch cities for the selected province
    const cityData = await cities(provinceCode);
    setCityList(cityData);

    // Reset barangay list
    setBarangayList([]);

    sendApiRequest(selectedRegion, provinceCode);
  };

  const sendApiRequest = async (selectedRegion, selectedProvince) => {
    try {
      const token = await getAccessTokenSilently({
        audience: configData.audience,
        scope: configData.scope,
      });
  
      setAccessToken(token);
  
      const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      });
  
      const uniqueProductIds = Object.keys(response.data.cart);
  
      // Get the province name
      const provinceName = provinceList.find(province => province.province_code === selectedProvince)?.province_name;
  
      // Update the location in the state with the province name
      const location = provinceName || "Unknown Province";
      const requestBody = {
        cart: uniqueProductIds,
        quantity: uniqueProductIds.map(id => response.data.cart[id]),
        province: location,
      };
  
      // Make the API call with the updated request body
      const apiResponse = await axios.post('http://localhost:8080/api/v1/cart/check', requestBody, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      });

      setApiResponse(apiResponse.data);
  
      // Handle the API response as needed
      console.log('API Response:', apiResponse.data);
  
      // Fetch and update products based on the new location or any other logic
      // ...
  
    } catch (error) {
      console.log('Error fetching data: ', error);
    }
  };  

  const handleCityChange = async (cityCode) => {
    setSelectedCity(cityCode);

    // Fetch barangays for the selected city
    const barangayData = await barangays(cityCode);
    setBarangayList(barangayData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: configData.audience,
          scope: configData.scope,
        });

        setAccessToken(token);

        const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        });

        setCartData(response.data);
        const uniqueProductIds = Object.keys(response.data.cart);

        try {
          const response = await axios.get('http://localhost:8080/api/v1/products');
          const productDetails = response.data;
          const productsInCart = productDetails.filter((product) => uniqueProductIds.includes(product.id));

          setProducts(productsInCart);
        } catch (error) {
          console.log('Error fetching product details: ', error);
        }

        
     
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [getAccessTokenSilently, setAccessToken, userId]);


  const handleCheckout = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: configData.audience,
        scope: configData.scope,
      });
  
      setAccessToken(token);
      
      const provinceName = provinceList.find(province => province.province_code === selectedProvince)?.province_name;
      
      const requestBody = {
        productsToAdd: Object.keys(cartData.cart),
        quantity: Object.values(cartData.cart),
        address: document.getElementsByName('address')[0].value,
        contact: document.getElementsByName('contactno')[0].value,  // Replace "contactno" with the actual contact number
        province: provinceName,
      };
  
      // Make the API call to initiate the checkout
      const checkoutResponse = await axios.post(`http://localhost:8080/api/v1/checkout/${userId}`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Checkout Response:', checkoutResponse.data);
  
      if (checkoutResponse.status === 200) {
        const productsToRemove = Object.keys(cartData.cart).map((item) => item);
  
        await axios.post(`http://localhost:8080/api/v1/cart/${userId}`, {
          productsToRemove: productsToRemove,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        setProducts((prevProducts) => prevProducts.filter((product) => !productsToRemove.includes(product.id)));
        location.href = '/';
      }
    } catch (error) {
      console.error('Error during checkout: ', error);
    }
  };
  

  return (
    <div>
      <div className='list-group mt-4'>
        <h2 className='my-3'>Checkout</h2>
        {products.map((product) => (
          <a href={'/product/' + product.prodName} className='list-group-item list-group-item-action d-flex flex-start align-items-center px-4' key={product.id}>
            <img className='me-5' src={product.img} alt={product.prodName} style={{ maxWidth: '100px' }} />
            <span className=''>{product.prodName}</span>
            <div className='ms-auto'>
            <span className=''>Qty: {cartData.cart[product.id]}</span>
            <div className='text-success ms-auto'>₱{product.price}</div>
            </div>
          </a>
        ))}
      </div>
    

    <div className='border border-2 rounded mt-4 p-3'>
      <div className='mt-4 d-flex justify-content-start align-items-center'>
      <label className='me-2'>Select Region:</label>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <select
          className='checkout'
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
        >
          <option value="" disabled>
            Select a region
          </option>
          {regionList.map((region) => (
            <option key={region.region_code} value={region.region_code}>
              {region.region_name}
            </option>
          ))}
        </select>
      )}

      <label className='ms-5 me-2'>Select Province:</label>
      {provinceList.length > 0 ? (
        <select
          className='checkout'
          value={selectedProvince}
          onChange={(e) => handleProvinceChange(e.target.value)}
        >
          <option value="" disabled>
            Select a province
          </option>
          {provinceList.map((province) => (
            <option key={province.province_code} value={province.province_code}>
              {province.province_name}
            </option>
          ))}
        </select>
      ) : (
        <select className='checkout' value={'Select a region to load provinces'} disabled>
          <option value="Select a region to load provinces" disabled>
          Select a region to load provinces
          </option>
        </select>
      )}

      </div>
      
      <div className='mt-4 d-flex justify-content-start align-items-center'>

      <label className='me-2'>Select City:</label>
      {cityList.length > 0 ? (
        <select
          className='checkout'
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
        >
          <option value="" disabled>
            Select a city
          </option>
          {cityList.map((city) => (
            <option key={city.city_code} value={city.city_code}>
              {city.city_name}
            </option>
          ))}
        </select>
      ) : (
        <select className='checkout' value={'Select a province to load cities'} disabled>
        <option value="Select a province to load cities" disabled>
        Select a province to load citie
        </option>
      </select>
      )}

      <label className='ms-5 me-2'>Select Barangay:</label>
      {barangayList.length > 0 ? (
        <select
          className='checkout'
          value={selectedBarangay}
          onChange={(e) => setSelectedBarangay(e.target.value)}
        >
          <option value="" disabled>
            Select a barangay
          </option>
          {barangayList.map((barangay) => (
            <option key={barangay.brgy_name} value={barangay.brgy_code}>
              {barangay.brgy_name}
            </option>
          ))}
        </select>
      ) : (
        <select className='checkout' value={'Select a city to load barangays'} disabled>
          <option value="Select a city to load barangays" disabled>
            Select a city to load barangays
          </option>
        </select>
      )}
    </div>
    <div className='d-flex mt-3 align-items-center'>
        <label htmlFor="address" className='me-2'>Address: </label>
        <input className="input-checkout" type="text" name='address'/>
    </div>

    <div className='d-flex mt-3 align-items-center'>
        <label htmlFor="contactno" className='me-2'>Contact no: </label>
        <input className="input-checkout" type="number" name='contactno'/>
    </div>
        
    {apiResponse && (
      <>
          <div className='mt-5 d-flex justify-content-between align-items-center'>

            <div className='mt-3 me-4 w-25 ms-auto'>
              <div className='d-flex justify-content-between'>       
                <p>Subtotal Price: </p> 
                <p> ₱{apiResponse.totalPrice}</p>
              </div>
              <div className='d-flex justify-content-between'> 
              <p>Delivery Fee:</p>
              <p> ₱{apiResponse.shippingFee}</p>
              </div>

              <div className='d-flex justify-content-between'> 
              <p>Total Price:</p>
              <p> ₱{apiResponse.shippingFee + apiResponse.totalPrice}</p>
              </div>

            </div>
                    </div>
            <div className='d-flex justify-content-end mt-4'>
              <button className='btn btn-primary' onClick={handleCheckout}>
                Checkout
              </button>
            </div>

          </>
        )}
    </div> 
   
    </div>
  );
};

export default Checkout;
