import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Token } from '../Token.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import  configData from '../config.json';

function Profile({ userId }) {
    const [user, setUser] = useState(null);
    let { accessToken, setAccessToken } = useContext(Token);

    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        // const fetchUser = async () => {
        //     const res = await axios.get(`/users/${userId}`);
        //     setUser(res.data);
        // };

        const fetchUser = async () => {
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

            setUser(response.data);
            } catch (error) {
                console.log('Error fetching data: ', error);
            }
        }

        fetchUser();
    }, [getAccessTokenSilently, setAccessToken, userId]);

    return (
        <div>
            {user ? (
                <div>
                    <h2>Hello, {user.name}</h2>
                    <img src={user.profilePicture} alt={user.name} />
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Profile