import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Token } from '../Token.jsx'; 
import { Toast } from 'react-bootstrap';

function ProductDetail({ userId }) {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { accessToken } = useContext(Token);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/products', {
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
          }
        });
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

  const handleAddToCart = async () => {

    try {
      setIsAddingToCart(true); // Set the button to disabled

      await axios.post(`http://localhost:8080/api/v1/cart/${userId}`, {
        productsToAdd: [product.id]
      }, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      setShowToast(true);
    } catch (error) {
      console.log('Error adding to cart: ', error);
    } finally {
      setIsAddingToCart(false); // Reset the button to enabled
    }
  
  };

  return (
    <div>
      {product ? (
        <>
          <div className='row mt-5'>
            <div className='col-lg-6'>
              <img src={product.img} height={400} alt={product.prodName} />
            </div>
            <div className='col-lg-6 text-start'>
              <h2 className='product-header mt-5'>{product.prodName}</h2>
              <p className='pt-4'>Specifications:</p>
            <ul className='prod-specs p-2'>
              {product.specs
                ? Object.entries(product.specs).map(([key, value]) => (
                    <li key={key} className='py-1'>
                      <strong className='text-uppercase'>{key}:</strong> {value}
                    </li>
                  ))
                : 'No specifications available'}
            </ul>

            <div className='d-flex flex-row'>
              <button className="btn btn-light req-btn rounded me-2 border border-black border-2" onClick={handleAddToCart} disabled={isAddingToCart}>Add to cart</button>
              <button className="btn btn-primary chat-prod-btn rounded">Chat with us</button>
            </div>
            </div>

          </div>
          
          <Toast show={showToast} onClose={() => setShowToast(false)} className="position-fixed bottom-0 end-0 m-3">

            <Toast.Header>
              <strong class="me-auto">CLR</strong>
              <small>1 sec ago</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </Toast.Header>
            <Toast.Body>
              <div className='text-start'>Product Added to Cart </div>
            </Toast.Body>


          </Toast>
        </>
      ) : (
        <div class="spinner-border mt-5" style={{width: 8 + 'rem', height: 8 + 'rem'}} role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
      )}
    </div>
  );
}

export default ProductDetail;
