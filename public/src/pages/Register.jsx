import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
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
    email: "",
    password: "",
    confirmPassword: "",
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
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
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
            <h1></h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(1deg, #000000, #ffffff);
  font-family: 'Poppins', sans-serif;

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: rgba(2, 234, 255, 0.1);
    padding: 3rem 5rem;
    border-radius: 1.5rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }

    .brand {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      img {
        height: 3rem;
      }

      h1 {
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 0.2rem;
      }
    }

    input {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 1rem;
      border: none;
      border-radius: 0.5rem;
      color: #ffffff;
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