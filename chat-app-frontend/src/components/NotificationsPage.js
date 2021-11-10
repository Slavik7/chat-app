import React, { useState } from "react";
import Notifications from "./Notifications";
import Requests from "./Requests";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";
const NotificationsPage = ({ requests, alert, token }) => {
  const [active, setActive] = useState(false); //false defualt for requests
  return (
    <NotificationsPageStyled>
      <Link to="/app">
        <IconButton className="icon-back">
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <div className="tags-container">
        <button
          className={`btn-option ${!active ? "active" : ""}`}
          disabled={!active}
          onClick={() => setActive(false)}
        >
          Requests
        </button>
        <button
          className={`btn-option ${active ? "active" : ""}`}
          disabled={active}
          onClick={() => setActive(true)}
        >
          Notifications
          {alert && alert.notifications && <div className="alert"></div>}
        </button>
      </div>
      <div className="notif-container">
        {!active ? (
          <Requests alert={alert} requests={requests} token={token} />
        ) : (
          <Notifications alert={alert} token={token} />
        )}
      </div>
    </NotificationsPageStyled>
  );
};

const NotificationsPageStyled = styled.div`
  width: 100%;
  height: 95%;

  position: relative;
  margin: 0 2rem;
  padding-top: 2rem;
  .icon-back {
    position: absolute;
    left: 1rem;
    top: 1rem;
  }

  .tags-container {
    display: flex;
    justify-content: center;
  }
  .btn-option {
    margin: 0.5rem 1rem;
    padding: 0.5em 1em;
    font-family: "Rubik", sans-serif;
    background: #fff;
    color: #696969;
    border: 1px solid #69696945;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
  }
  .notif-btn {
    background: green;
    position: relative;
  }
  .alert {
    position: absolute;
    border-radius: 50%;
    height: 8px;
    width: 8px;
    background: #ff000073;
    z-index: 9999;
    right: -2px;
    top: -2px;
  }
  .active {
    cursor: auto;
    background: #0b9cdf3b;
  }
  .notif-container {
    height: 90%;
    display: flex;
  }
`;

export default NotificationsPage;
