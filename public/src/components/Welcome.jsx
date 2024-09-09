import React from 'react'
import styled from "styled-components"
import Logout from './Logout'
import back from "../assets/photochat.jpg"

export default function Welcome({currentUser}) {
  return (
    <Container>
        <LogoutWrapper>
        <Logout/>

        </LogoutWrapper>
        
        <img src={back} alt="robot" />
        <h1>
            Welcome! <span>{currentUser.username}!</span>
        </h1>
        <h3>Please select a chat to Start Messaging.</h3>
    </Container>
  )
}
const Container = styled.div` display: flex;
justify-content: center;
align-items: center;
color: white;
flex-direction: column;
img {
  height: 20rem;
  width:26.4rem;
}
span {
  color: #000000;
}`;
const LogoutWrapper = styled.div`
position: absolute;
  top: 2rem;
  right: 8rem;`;
