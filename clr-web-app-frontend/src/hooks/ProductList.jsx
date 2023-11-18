import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Token } from '../../Token.jsx'; 

function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const { accessToken } = useContext(Token);
  console.log(accessToken)

  const config = {
    headers: {
      'Authorization': 'Bearer '+accessToken,
      'Content-type': "application/json"
    }
};

  const getProducts = async () => {
    try {
      const response = await axios.get(
      'http://localhost:8080/api/v1/products/',
      null,
      config
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
              <p>{product.prodId}</p>
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
