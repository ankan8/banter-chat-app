import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute ,host} from "../utils/APIRoutes";
import Touch from "../components/Touch";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client"
const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat,setCurrentChat] =useState(undefined);
  const [isLoaded,setIsLoaded]= useState(false);

  // // Fetch current user from local storage
  useEffect(() => {
    const fetchUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };
    
    fetchUser();
  }, [navigate]);
  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user",currentUser._id);
    }

  },[currentUser])

  // // Fetch contacts if user is logged in
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const  data  = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data.data);
          } catch (error) {
            console.error("Error fetching contacts:", error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);
  const handleChatChange =(chat)=>{
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Touch contacts= {contacts} currentUser ={currentUser} changeChat={handleChatChange}/>
        {isLoaded&& currentChat === undefined ? (
        <Welcome currentUser={currentUser} />
      ) : (
        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
      )}
        
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #61646b; /* Telegram-like dark background */
  
  .container {
    border-radius: 15px;
    height: 94vh;
    width: 85vw;
    background-color: #7d6464; /* Dark background for chat container */
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 10px;
    box-shadow: 0px 5px 15px rgba(59, 58, 58, 0.2);

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;


export default Chat;
