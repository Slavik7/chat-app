import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { acceptRequest, rejectRequest, userImage } from "../api";
import styled from "styled-components";
import axios from "axios";
import { Avatar, Button } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import {
  friendsUpdate,
  requestsUpdate,
  updateAlertFS,
} from "../actions/userActions";
const Requests = ({ alert, requests, token }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (alert.requests) {
      const newAlert = { notifications: alert.notifications, requests: false };
      dispatch(updateAlertFS(newAlert, token));
    }
  }, []);
  //friends handler

  const acceptFriendHandler = async (id) => {
    await axios
      .post(
        acceptRequest(),
        { id: id },
        {
          headers: { "x-auth-token": token },
        }
      )
      .then((res) => {
        dispatch(requestsUpdate(token));
        dispatch(friendsUpdate(token));
      });
  };
  const rejectFriendHandler = async (id) => {
    await axios
      .post(
        rejectRequest(),
        { id: id },
        {
          headers: { "x-auth-token": token },
        }
      )
      .then((res) => {
        dispatch(requestsUpdate(token));
      });
  };

  return (
    <RequestsStyled>
      <div className="users-container">
        {requests.length > 0 &&
          requests.map((userReq) => (
            <div className="user" key={userReq._id} id={userReq._id}>
              <Avatar
                src={
                  userReq.image.image.length > 0
                    ? userImage(userReq.image.image)
                    : ""
                }
                alt="user name here"
              />
              <div className="user-info">
                <h3>{userReq.name}</h3>
              </div>
              <div className="response-options">
                <Button
                  size="small"
                  className="btn-accept"
                  onClick={(e) => acceptFriendHandler(userReq._id)}
                >
                  <CheckIcon />
                  <p>Accept</p>
                </Button>
                <Button
                  size="small"
                  className="btn-reject"
                  onClick={(e) => rejectFriendHandler(userReq._id)}
                >
                  <ClearIcon />
                  <p>Reject</p>
                </Button>
              </div>
            </div>
          ))}
      </div>
    </RequestsStyled>
  );
};

export default Requests;

const RequestsStyled = styled.div`
  width: 100%;
  margin: 0 2rem;
  overflow-y: scroll;
  position: relative;
  .icon-back {
    position: absolute;
    left: 1rem;
    top: 1rem;
  }
  .users-container {
    margin-top: 1rem;
  }
  .user {
    display: flex;
    padding: 0.8rem;
    border-bottom: 1px solid #6d6d6d3d;
    transition: all 0.2s ease;
    width: 100%;

    &:hover {
      background: #bbbbbb3c;
    }
    .MuiAvatar-root {
      margin-right: 0.5rem;
      width: 4rem;
      height: 4rem;
    }
    .user-info {
      width: 50%;
      h3 {
        font-size: 1rem;
        margin-bottom: 0.3rem;
        font-weight: 500;
      }
      p {
        font-weight: 300;
      }
    }
    .response-options {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      .MuiButtonBase-root {
        cursor: pointer;
        margin: 0 1rem;
        border: 1px solid #6d6d6d3d;
        z-index: 99;
        display: flex;
        justify-content: center;
        transition: background 0.3s ease;
        p {
          padding-left: 0.2rem;
        }
      }
      .btn-reject {
        background: #ff000058;
        &:hover {
          background: #ff000090;
        }
      }
      .btn-accept {
        background: #40ad4058;
        &:hover {
          background: #40ad4090;
        }
      }
    }
    .responded {
      content: "responded";
      .btn-reject {
        display: none;
      }
      .btn-accept {
        display: none;
      }
    }
  }
`;
