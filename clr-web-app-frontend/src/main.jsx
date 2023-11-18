import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import Navbar from './components/Navbar.jsx'

import { Auth0Provider } from '@auth0/auth0-react'
import { TokenProvider } from '../Token.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TokenProvider>
    <Auth0Provider
    domain="dev-k5h56p77fu76lhif.us.auth0.com"
    clientId="zqRRIfEtTI3GOUeHzedGk8BQsN8hlx0c"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-k5h56p77fu76lhif.us.auth0.com/api/v2/",
      scope: "read:current_user update:current_user_metadata"
    }}
    >
      <React.StrictMode>
        <Navbar />
        <App />
      </React.StrictMode>
    </Auth0Provider>
  </TokenProvider>
  
  
)
