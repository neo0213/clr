import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'

// Components
import App from './App.jsx'
import './index.css'

// Authentication
import { Auth0Provider } from '@auth0/auth0-react'
import { TokenProvider } from './Token.jsx'
import configData from './config.json'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TokenProvider>
    <Auth0Provider
    domain={configData.domain}
    clientId={configData.clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: configData.audience,
      scope: configData.scope
    }}
    >
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </Auth0Provider>
  </TokenProvider>
  
  
)
