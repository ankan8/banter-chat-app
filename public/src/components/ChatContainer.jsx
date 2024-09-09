import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import {v4 as uuidv4} from "uuid"
import axios from 'axios';
import { useRef } from 'react';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';

export default function ChatContainer({ currentChat, currentUser ,socket}) {
  const [messages, setMessages] = useState([]);
  const[arrivalMessage,setArrivalMessage]=useState(null);
  const scrollRef=useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
       
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
    
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    try {
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg",{
        to:currentChat._id,
        from:currentUser._id,
        message:msg,
      });
      const msgs=[...messages];
      msgs.push({fromSelf:true,message:msg});
      setMessages(msgs);
      // Optionally update the message list or trigger a fetch to get the new message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);
  
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behaviour:"smooth"})
  },[messages])

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message) => {
                return(
              <div ref={scrollRef} key={uuidv4}>
                <div className={`message ${message.fromSelf ? 'sended' : 'recieved'}`}>
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
)})}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: #ffffff;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 50rem;
        color: #ffffff;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #ffffff1f;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #ffffff1f;
      }
    }
  }
`;
