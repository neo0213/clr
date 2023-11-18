import React, { createContext, useState } from 'react';

export const Token = createContext(null);
export const TokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
    return (
      <Token.Provider value={{ accessToken, setAccessToken }}>
        {children}
      </Token.Provider>
    );
  }
  