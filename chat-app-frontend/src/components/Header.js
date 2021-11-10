import React from "react";
import styled from "styled-components";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";

const Header = ({ alert }) => {
  return (
    <HeaderStyled>
      <Link to="/app" className="logo">
        <h3>Chat App</h3>
      </Link>
      <div className="options">
        <Link to="/app/settings">
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </Link>
        <Link to="/app/addfriends">
          <IconButton>
            <PersonAddIcon />
          </IconButton>
        </Link>
        <Link to="/app/notifications">
          <IconButton>
            <NotificationsIcon />
            {alert && (alert.requests || alert.notifications) > 0 && (
              <div className="alert"></div>
            )}
          </IconButton>
        </Link>
      </div>
    </HeaderStyled>
  );
};

export default Header;

const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
  height: 5%;
  max-height: 5rem;
  .options {
    flex: 0.5;
    display: flex;
    justify-content: space-between;
  }
  .logo {
    flex: 0.5;
    cursor: pointer;
    text-decoration: none;
    color: #000;
    h3 {
      font-weight: 500;
    }
  }
  .MuiIconButton-root {
    position: relative;
    .alert {
      position: absolute;
      border-radius: 50%;
      height: 8px;
      width: 8px;
      background: #ff0000;
      z-index: 9999;
      right: 30%;
      top: 30%;
    }
  }
`;
