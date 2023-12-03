// App.jsx
import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProductList from './hooks/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/cart.jsx';
import Checkout from './components/checkout.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import { Token } from './Token.jsx';
import  configData from './config.json';
import Message from './components/Message.jsx';


import { App as SendbirdApp, Channel as SendbirdChannel } from "sendbird-uikit";
import SendBird from "sendbird";
import "sendbird-uikit/dist/index.css";


const APP_ID = "FAF0A502-9C9E-47EB-94B2-4279F4AEFB7E";
const OTHER_USER_ID = "sendbird_desk_agent_id_49a13fd6-71e5-47dc-be34-831c27aba421";


function App() {
  let { setAccessToken } = useContext(Token);
  let userId;
  const [channelUrl, setChannelUrl] = useState(null);
  const [groupChannel, setGroupChannel] = useState(null);
  const [sb, setSB] = useState(null);
  const {
    user,
    getAccessTokenSilently
  } = useAuth0();

  try {
    userId = (user.sub).split('|').pop().trim();
    console.log(userId);
  } catch (error) {
    console.log("Must login first:",error.message);
  }



  useEffect(() => { // This block of code is for requesting an access token to be used for each request
    const getAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: configData.audience,
          scope: configData.scope,
        });
        setAccessToken(accessToken); // Saves the accessToken as a Context which essentially allows it to be a global variable
      } catch (e) {
        console.log(e.message);
      }
    };
    getAccessToken();
  }, [getAccessTokenSilently]); 

  const createSendbirdChannel = () => {
    const sb = new SendBird({ appId: APP_ID });

    setSB(sb);

    sb.connect(userId, null, (user, error) => {
      if (error) {
        console.log("SendBird Login Failed:", error);
        return;
      }

      const params = new sb.GroupChannelParams();
      params.isDistinct = false;
      params.addUserIds([OTHER_USER_ID]);

      sb.GroupChannel.createChannel(params, (groupChannel, error) => {
        if (error) {
          console.error("SendBird Group Channel Creation Failed:", error);
        } else {
          console.log("Group Channel:", groupChannel);
          setChannelUrl(groupChannel.url);
          setGroupChannel(groupChannel);

          // Send a message after the group channel is created
          const messageParams = new sb.UserMessageParams();
          messageParams.message = "Requesting a quote";
          groupChannel.sendUserMessage(messageParams, (message, error) => {
            if (error) {
              console.error("SendBird Message Sending Failed:", error);
            } else {
              console.log("Message sent successfully:", message);
            }
          });
        }
      });
    });
  };

    // Create channel on component mount
    useEffect(() => {
      createSendbirdChannel();
    }, [userId]);

  const categories = ['Power Tools', 'PPE', 'Welding Machine'];

  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route  path="/" element={categories.map((category) => (
        <ProductList key={category} category={category} userId={userId}/> ))} />
          

          <Route path="/product/:productName" element={<ProductDetail userId={userId}/>} />
          <Route path='/cart' element={<Cart userId={userId} channelUrl={channelUrl} setChannelUrl={setChannelUrl} groupChannel={groupChannel} sb={sb}/> }/>
          <Route path='/login' element={<Cart userId={userId}/>}/>
          <Route path='/checkout' element={<Checkout userId={userId}/>}/>
        </Routes>
        <Message userId={userId} setChannelUrl={setChannelUrl} channelUrl={channelUrl}/>
      </div>
    </Router>
    </>
  );
}

export default App;
