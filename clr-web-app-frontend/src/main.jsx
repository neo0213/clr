import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Navbar from './components/Navbar.jsx'
import configData from './config.json'

import { Auth0Provider } from '@auth0/auth0-react'
import { TokenProvider } from './Token.jsx'
import ProductDetail from './components/ProductDetail.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <>
      <Navbar />
      <App />
    </>,
  },
  {
    path: "/product/:productName",
    element: 
    <>
      <Navbar />
      <ProductDetail />
    </>,
  },
])

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
        <RouterProvider router={router}/>
      </React.StrictMode>
    </Auth0Provider>
  </TokenProvider>
  
  
)
