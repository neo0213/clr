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
import Orders from './components/orders.jsx';
import axios from 'axios';
import { App as SendbirdApp, Channel as SendbirdChannel } from "sendbird-uikit";
import SendBird from "sendbird";
import "sendbird-uikit/dist/index.css";
import ChatAdmin from './components/ChatAdmin.jsx';
import ProductForm from './components/AdminDashboard.jsx';
import FetchProductAdmin from './components/fetchProduct.jsx';
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

    if(userId){
      if(userId !== '656f279d8117da0d8b51e41b'){

     
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
      params.includeEmptyChannel=true;
      // params.setIncludeEmpty(true);
      sb.GroupChannel.createChannel(params, (groupChannel, error) => {
        if (error) {
          console.error("SendBird Group Channel Creation Failed:", error);
        } else {
          console.log("Group Channel:", groupChannel);
          setChannelUrl(groupChannel.url);
          setGroupChannel(groupChannel);
          
          axios.post(`https://api-${APP_ID}.sendbird.com/v3/group_channels/${groupChannel.url}/messages`, {
            message_type: "MESG",
            user_id: OTHER_USER_ID,
            message: "Welcome to CLR"
        }, {
          headers: {
            'Api-Token': 'c135512119ebf24c5d4caa08acc635e57078ec1f',
          },
        })
          .then(response => {
            console.log('Success:', response.data);
          })
          .catch(error => {
            console.error('Error:', error.message);
          });

        }
      });
    });
  } else if( userId == "656f279d8117da0d8b51e41b"){

  }
} 
  };

    // Create channel on component mount
    useEffect(() => {
      createSendbirdChannel();
    }, [userId]);

  const categories = ['Power Tools', 'PPE', 'Welding Machine', 'Belt Driven Air Compressor', 'Oilless Air Compressor'];

  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const Tab1Content = () => (
    <div>
            <ProductForm userId={userId}/>
    </div>
  );
  
  const Tab2Content = () => (
    <div>
      <ChatAdmin/>
    </div>
  );

  const Tab3Content = () => (
    <div>
      <FetchProductAdmin userId={'106571512188032008215'}/>
    </div>
  );

  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route  path="/" element={
          <>
            {categories.map((category) => (
              <ProductList key={category} category={category} userId={userId} />
            ))}
            <Message userId={userId} setChannelUrl={setChannelUrl} channelUrl={channelUrl} />
          </>
        } />
          

          <Route path="/product/:productName" element={<><ProductDetail userId={userId}/> <Message userId={userId} setChannelUrl={setChannelUrl} channelUrl={channelUrl} sb={sb} /></>} />
          <Route path='/cart' element={<><Cart userId={userId} channelUrl={channelUrl} setChannelUrl={setChannelUrl} groupChannel={groupChannel} sb={sb}/><Message userId={userId} setChannelUrl={setChannelUrl} channelUrl={channelUrl} />  </>}/>
          <Route path='/login' element={<><Cart userId={userId}/><Message userId={userId} setChannelUrl={setChannelUrl} channelUrl={channelUrl} /> </>}/>
          <Route path='/checkout' element={<><Checkout userId={userId}/><Message userId={userId} setChannelUrl={setChannelUrl} channelUrl={channelUrl} /> </>}/>
          <Route path='/orders' element={<><Orders userId={userId}/><Message userId={userId} setChannelUrl={setChannelUrl} channelUrl={channelUrl} /> </>}/>
          <Route path='/ChatAdmin' element={<><ChatAdmin userId={userId} channelUrl={channelUrl} setChannelUrl={setChannelUrl} groupChannel={groupChannel}/></>}/>
          <Route path='/user-orders' element={<FetchProductAdmin userId={userId}/>}/>
          <Route path='/Admin-Dashboard' element={
            <div>
            <div>
              <button className='me-2' onClick={() => handleTabClick('tab1')}>Add Products</button>
              <button className='me-2' onClick={() => handleTabClick('tab2')}>Chat</button>
              <button className='me-2' onClick={() => handleTabClick('tab3')}>Orders</button>
            </div>
      
            <div>
              {activeTab === 'tab1' && <Tab1Content />}
              {activeTab === 'tab2' && <Tab2Content />}
              {activeTab === 'tab3' && <Tab3Content />}
            </div>
          </div>
          
          
          }/>
        </Routes>
    </div>
    </Router>
    </>
  );
}

export default App;
