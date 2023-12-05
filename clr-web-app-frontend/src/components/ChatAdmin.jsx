import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Token } from '../Token'; 
import { Toast } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { App as SendbirdApp, Channel as SendbirdChannel } from "sendbird-uikit";
import "sendbird-uikit/dist/index.css";

const APP_ID = "FAF0A502-9C9E-47EB-94B2-4279F4AEFB7E";
const ADMIN_USER_ID = "113993674660220984866";

function ChatAdmin({ userId, channelUrl }) {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  let { accessToken } = useContext(Token);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get('/api/v1/products');
        const productDetails = response.data;
        const foundProduct = productDetails.find((p) => p.prodName === productName);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.log(`Product with name ${productName} not found`);
        }
      } catch (error) {
        console.log('Error fetching product details: ', error);
      }
    };

    fetchProductDetails();
  }, [productName]);

  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    console.log(userId);
  }




  return (
    <>
    <div className='admin-user'>
      <SendbirdApp appId={APP_ID} userId={ADMIN_USER_ID} />
    </div>

    </>
  );
}

export default ChatAdmin;
