import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Token } from '../Token.jsx';
import 'react-loading-skeleton/dist/skeleton.css';

function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useContext(Token);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/products'
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching products: ', error);
    }
  };

  const filteredProducts = products.filter((product) => product.category === category);

  return (
    <>
      <h2 className="cat-label mt-5 mb-4">{category}</h2>
      <div className="container-product scroll">
        {
        loading ? (
          // Display 5 skeleton loaders
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="product-card text-black">
              <Skeleton height={200} width={200} />
              <div className="mt-4">
                <Skeleton height={20} width={150} />
                <Skeleton height={12} width={100} />
              </div>
            </div>
          ))
        ) : (
          // Display actual products after data is fetched
          filteredProducts.map((product) => (
            <Link to={`/product/${product.prodName}`} key={product.prodId} className="product-card text-black">
              <img className='img-card' src={product.img} alt={product.prodName} />
              <div className="mt-4">
                <h4>{product.prodName}</h4>
                </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}

export default ProductList;
