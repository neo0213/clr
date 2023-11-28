import React, { createContext, useState } from 'react';

export let Token = createContext(null);
export let TokenProvider = ({ children }) => {
  let [accessToken, setAccessToken] = useState(null);
    return (
      <Token.Provider value={{ accessToken, setAccessToken }}>
        {children}
      </Token.Provider>
    );
  }
  