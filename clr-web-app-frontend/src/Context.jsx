import React, { useState, createContext } from "react";
 
export const Context = createContext(null);
export const ContextProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    return (
        <Context.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </Context.Provider>
    );
};