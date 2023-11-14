import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/products');
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
              <button className="btn btn-light req-btn rounded me-2 border border-black border-2">Add to cart</button>
              <button className="btn btn-primary chat-prod-btn rounded">Chat with us</button>
            </div>
            </div>

          </div>

        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProductDetail;
