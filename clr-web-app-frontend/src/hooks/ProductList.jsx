import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Token } from '../../Token.jsx'; 

function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const { accessToken } = useContext(Token);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(
      'http://localhost:8080/api/v1/products', {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
        }
      }
      );
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching products: ', error);
    }
  };

  const filteredProducts = products.filter((product) => product.category === category);

  return (
    <>
      <h2 className="cat-label mt-5 mb-4">{category}</h2>
      <div className="container-product scroll">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.prodName}`} key={product.prodId} className="product-card text-black">
            <img className='img-card' src={product.img} alt={product.prodName} />
            <div className="mt-4">  
              <p>{product._id}</p>
              <h4>{product.prodName}</h4>
              <p>{product.specs?.weight ? product.specs.weight : ('')}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default ProductList;
