import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  userLogout,
  userUpdateToken,
  updateUserImage,
} from "../actions/userActions";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Avatar, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import Toggle from "./Toggle";
import { changeName, changePassword, uploadUserImageURL } from "../api";
import axios from "axios";
import { popMsg } from "../actions/popMsgActions";
import { userImage } from "../api";
const Settings = ({ user, setPopMsg, setPopMsgActive }) => {
  const dispatch = useDispatch();
  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [imagePath, setImagePath] = useState("");
  const logOutHandler = () => {
    if (window.confirm("Sure you want to logout?")) {
      dispatch(userLogout());
      window.location.assign("/");
    }
  };

  const changeNameHandler = async (e) => {
    e.preventDefault();
    if (newName.length >= 3) {
      const userData = await axios
        .put(
          changeName(),
          { newName: newName },
          {
            headers: { "x-auth-token": user.token },
          }
        )
        .catch((err) =>
          dispatch(popMsg("Error with the server, Name not changed"))
        );
      if (userData) {
        dispatch(userUpdateToken(userData.data));
        dispatch(popMsg("Name Changed Successfully"));
      }
    } else {
      dispatch(popMsg("Name need to be at least 3 characters long"));
    }
  };
  const changePasswordHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== repeatPassword)
      setPopMsg("New password and Repeat Password not the same");
    else if (newPassword.length >= 5 && oldPassword.length >= 5) {
      await axios
        .put(
          changePassword(),
          { password: oldPassword, newPassword: newPassword },
          { headers: { "x-auth-token": user.token } }
        )
        .then((res) => {
          setPopMsg("password changed successfully");
        })
        .catch((err) => {
          setPopMsg("Error with the server, Password not changed");
        });
    }
    setPopMsgActive(true);
  };

  const imageUploadHandler = async (e) => {
    e.preventDefault();
    if (imagePath) {
      const formData = new FormData();
      formData.append("image", imagePath);
      await axios
        .post(uploadUserImageURL(), formData, {
          headers: { "x-auth-token": user.token },
        })
        .then((r) => dispatch(updateUserImage(user.token)));
    }
  };
  return (
    <SettingsWindowStyle>
      <h3>Hi {user.name}</h3>
      <Avatar
        className="avatar"
        src={user.image ? userImage(user.image) : ""}
        alt={user.name}
      />
      <Link to="/app">
        <IconButton className="icon-back">
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <div className="settings-options">
        <Toggle>
          <button className="option">Change Name</button>
          <form className="input-data">
            <label className="input-label">
              <p>New Name:</p>
              <input
                type="text"
                minLength="3"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              ></input>
            </label>
            <button
              className="btn-submit"
              type="submit"
              onClick={changeNameHandler}
            >
              Confirm
            </button>
          </form>
        </Toggle>
        <Toggle>
          <button className="option">Change Password</button>
          <form className="input-data">
            <label className="input-label">
              <p placeholder="current pasword">Current Password:</p>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                minLength="5"
              ></input>
            </label>
            <label className="input-label">
              <p>New Password:</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength="5"
              ></input>
            </label>
            <label className="input-label">
              <p>Repeat New Password:</p>
              <input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                minLength="5"
              ></input>
            </label>
            <button
              className="btn-submit"
              type="submit"
              onClick={changePasswordHandler}
            >
              Confirm
            </button>
          </form>
        </Toggle>
        <Toggle>
          <button className="option">Upload Profile Image</button>
          <form className="input-data">
            <label className="image-input">
              <input
                type="file"
                name="image"
                onChange={(e) => setImagePath(e.target.files[0])}
              ></input>
            </label>
            <button
              className="btn-submit"
              type="submit"
              onClick={imageUploadHandler}
            >
              Upload
            </button>
          </form>
        </Toggle>
      </div>
      <button className="btn-logout" onClick={logOutHandler}>
        Logout
      </button>
    </SettingsWindowStyle>
  );
};

export default Settings;

const SettingsWindowStyle = styled.div`
  width: 100%;
  display: flex;
  height: 95%;
  margin: 0 2rem;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  position: relative;
  .avatar {
    margin-top: 1rem;
    width: 4rem;
    height: 4rem;
    background: #6d6d6d15;
  }

  .icon-back {
    position: absolute;

    left: 1rem;
    top: 1rem;
  }
  button {
    font-family: "Rubik", sans-serif;
  }
  .settings-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 1.5rem;
  }
  .option {
    text-decoration: none;
    padding: 0.2em 1em;
    margin: 1rem 0;
    background: none;
    border: 1px solid #6d6d6d3d;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
  }
  .btn-submit {
    background: #07880724;

    cursor: pointer;
    font-weight: 400;
    font-size: 0.7rem;
    border: solid 1px #6d6d6d3d;
    border-radius: 5px;
    padding: 0.2em 0;
    margin-top: 0.5rem;
    transition: background 0.2s ease;
    &:hover {
      background: #07880750;
    }
  }
  .input-data {
    margin: 0.2rem 0;
    display: flex;
    flex-direction: column;
  }
  .input-label {
    p {
      font-size: 0.8rem;
      margin-bottom: 0.4rem;
    }
    input {
      margin-bottom: 1rem;
    }
  }
  .btn-logout {
    font-family: "Rubik", sans-serif;
    position: absolute;
    color: #685858a6;
    right: 0.5rem;
    bottom: 0.5rem;
    background: #fff;
    border: 1px solid #5a36363c;
    border-radius: 4px;
    padding: 0.2em;
    cursor: pointer;
    transition: background 0.2s ease;
    &:hover {
      background: #ff000010;
    }
  }
`;
