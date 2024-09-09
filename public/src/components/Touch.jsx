import React,{useState,useEffect} from 'react'
import styled from "styled-components"
import Logo from "../assets/logo.svg"
export default function Touch({contacts,currentUser,changeChat}) {
    const [currentUserName,setCurrentUserName]=useState(undefined);
    const [currentUserImage,setCurrentUserImage]=useState(undefined);
    const [currentSelected,setCurrentSelected] = useState(undefined);
    useEffect(()=>{
        if(currentUser){
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);

        }

    },[currentUser]);
    const changeCurrentChat=(index,contact)=>{
        setCurrentSelected(index);
        changeChat(contact);

    }

  return (
    <>
    {
        currentUserImage && currentUserName && (
            <Container>
                <div className="brand">
                    <img src={Logo} alt="logo" />
                    <h3>Banter</h3>

                </div>
                <div className="contacts">
                    {
                        contacts.map((contact,index)=>{
                            return(
                                <div className={`contact ${index === currentSelected ? "selected":""}`} key= {index} onClick={()=>changeCurrentChat(index,contact)}>
                                    <div className="avatar">
                                        <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
                <div className="current-user">
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                </div>
                <div className="username">
                    <h2>{currentUserName}</h2>
                </div>
                    
                </div>
            </Container>
        )
    }
    </>
  )
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #242832; /* Slightly darker than chat window */
  border-top-left-radius :9px ;
  border-bottom-left-radius: 9px;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: #ffffff;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    gap: 0.8rem;
    padding: 0.5rem;
    background-color: #1a1c21;
    

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #4a4a4a;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #2c303a;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.4rem;
      padding: 0.6rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.3s ease-in-out;

      &:hover {
        background-color: #6f809b;
      }

      .avatar img {
        height: 3rem;
      }
      .username h3 {
        color: #ffffff;
      }
    }
    .selected {
      background-color: #7d6464; /* Similar to Telegram's selected contact */
    }
  }

  .current-user {
    background-color: #1e202b;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 0.5rem;

    .avatar img {
      height: 4rem;
    }
    .username h2 {
      color: #ffffff;
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username h2 {
        font-size: 1rem;
      }
    }
  }
`;
