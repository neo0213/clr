import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Token } from '../Token.jsx';

export function ShoppingCart() {
    const [ cart, setCart ] = useState([]);
    const { accessToken } = useContext(Token);

    useEffect(() => {
        getCart();
    }, []);

    const getCart = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/v1/cart', {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${accessToken}`,
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
                    }
                }
            );
            setCart(response.data);
        } catch (error) {
            console.log('Error fetching products: ', error);
        }
    };
    


    return (
        <>
            <div>
                <h1>Cart</h1>
                {cart.map((user) => (
                    <div key={user.userId}>
                        <h1>{user.cartId}</h1>
                        <div>{user.productIds}</div>
                    </div>

                ))}
            </div>
        </>
    )
}