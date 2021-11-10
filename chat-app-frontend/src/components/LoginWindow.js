import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { newUser } from "../api";
import axios from "axios";
import { popMsg } from "../actions/popMsgActions";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, userLoginByToken } from "../actions/userActions";
import PopupMessage from "./PopupMessage";
import { Redirect } from "react-router-dom";
const LoginWindow = ({ user }) => {
  const dispatch = useDispatch();
  const popMessage = useSelector((state) => state.popMessage);
  useEffect(() => {
    if (!user.active) {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        dispatch(userLoginByToken(JSON.parse(userToken)));
      }
    }
  }, [dispatch]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [register, setRegister] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (register) {
      const data = await axios
        .post(newUser(), {
          name: name,
          email: email,
          password: password,
        })
        .catch((err) => {
          dispatch(popMsg(err.message));
        });
      if (data) dispatch(popMsg("Registration completed! you can Login now"));
    } else {
      dispatch(userLogin(email, password));
    }

    setPassword("");
  };
  return (
    <LoginWindowStyled>
      {popMessage.active && <PopupMessage />}
      {user.active && <Redirect to="/app" />}
      <h3>{!register ? "Login" : "Register"} to Chat App.</h3>
      <form onSubmit={submitHandler}>
        <label>
          <p>Email:</p>
          <input
            type="email"
            placeholder="type your email here"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </label>
        {register ? (
          <label>
            <p>Name:</p>
            <input
              type="text"
              placeholder="type your name or nickname here"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </label>
        ) : (
          ""
        )}
        <label>
          <p>Password:</p>
          <input
            minLength="5"
            type="password"
            placeholder="type your password here"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </label>
        <button type="submit">{!register ? "Login" : "Register"}</button>
      </form>

      <a
        className="register"
        onClick={() => {
          setRegister((state) => !state);
        }}
      >
        {!register ? "Not registered?" : "to Login"} <span>click here</span>
      </a>
    </LoginWindowStyled>
  );
};

export default LoginWindow;

const LoginWindowStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
  width: 100%;
  h3 {
    margin-bottom: 2rem;
    font-weight: 400;
  }
  form {
    display: flex;
    flex-direction: column;
    label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      width: 23rem;
      font-weight: 200;
    }
    input {
      font-size: 0.9rem;
      height: 1.8rem;
      width: 15rem;
    }
    button {
      height: 1.5rem;
      width: 100%;
      background: none;
      border-radius: 0.3rem;
      border: 1px solid #6d6d6d3d;
      cursor: pointer;
      &:hover {
        background: #6d6d6d3d;
      }
    }
  }

  .register {
    margin-top: 2rem;
    font-weight: 200;
    span {
      border: 1px solid #6d6d6d3d;
      padding: 0 0.3rem;
      cursor: pointer;
      &:hover {
        background: #6d6d6d3d;
      }
    }
  }
`;
