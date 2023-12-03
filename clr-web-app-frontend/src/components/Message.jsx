import React, { useEffect, useState } from "react";
import { App as SendbirdApp, Channel as SendbirdChannel } from "sendbird-uikit";
import SendBird from "sendbird";
import "sendbird-uikit/dist/index.css";
import "./styleMessage.css";
import Modal from 'react-modal';

const APP_ID = "FAF0A502-9C9E-47EB-94B2-4279F4AEFB7E";
const OTHER_USER_ID = "sendbird_desk_agent_id_49a13fd6-71e5-47dc-be34-831c27aba421";

export default function Message({ userId, quoteMessage, channelUrl }) {
  let USER_ID = userId;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // Function to create Sendbird channel
  // const createSendbirdChannel = () => {
  //   const sb = new SendBird({ appId: APP_ID });

  //   sb.connect(USER_ID, null, (user, error) => {
  //     if (error) {
  //       console.log("SendBird Login Failed:", error);
  //       return;
  //     }

  //     const params = new sb.GroupChannelParams();
  //     params.isDistinct = false;
  //     params.addUserIds([OTHER_USER_ID]);

  //     sb.GroupChannel.createChannel(params, (groupChannel, error) => {
  //       if (error) {
  //         console.error("SendBird Group Channel Creation Failed:", error);
  //       } else {
  //         console.log("Group Channel:", groupChannel);
  //         setChannelUrl(groupChannel.url);

  //         // Send a message after the group channel is created
  //         const messageParams = new sb.UserMessageParams();
  //         messageParams.message = quoteMessage || "Requesting a quote";
  //         groupChannel.sendUserMessage(messageParams, (message, error) => {
  //           if (error) {
  //             console.error("SendBird Message Sending Failed:", error);
  //           } else {
  //             console.log("Message sent successfully:", message);
  //           }
  //         });
  //       }
  //     });
  //   });
  // };

  // Create channel on component mount
  // useEffect(() => {
  //   createSendbirdChannel();
  // }, []); // Empty dependency array means this effect runs once on mount

  const customStyles = {
    content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };

  return (
    <div className="Message">
      <button onClick={openModal}>Messages</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Message"
        style={customStyles}
      >
        <SendbirdApp appId={APP_ID} userId={USER_ID}>
          {channelUrl && <SendbirdChannel channelUrl={channelUrl} />}
        </SendbirdApp>
        <button onClick={closeModal} className="mt-3">Close</button>
      </Modal>
    </div>
  );
}
