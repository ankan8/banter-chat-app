import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
  
    password: "",
    
  });

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, username } = values;
    if (password ==="") {
      toast.error(
        "email and password is required",
        toastOptions
      );
      return false;
    } else if (username.length==="") {
      toast.error(
        "email and password is required",
        toastOptions
      );
      return false;
    }  

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const {  username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          "chat-app-user",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          
          <button type="submit">Login User</button>
          <span>
            Don't have an account ? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(1deg, #000000, #ffffff);
  font-family: 'Poppins', sans-serif;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 3rem;
    }

    h1 {
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.2rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: rgba(0, 225, 255, 0.1);
    padding: 3rem 5rem;
    border-radius: 1.5rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }

    input {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 1rem;
      border: none;
      border-radius: 0.5rem;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;

      &::placeholder {
        color: #e0e0e0;
      }

      &:focus {
        background-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
      }
    }

    button {
      background-color: #6c63ff;
      color: #fff;
      padding: 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.1rem;
      letter-spacing: 0.05rem;
      text-transform: uppercase;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        background-color: #5753c9;
        transform: translateY(-3px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    span {
      color: #fff;
      text-align: center;

      a {
        color: #4e45fd;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;

        &:hover {
          color: #928dab;
        }
      }
    }
  }
`;
