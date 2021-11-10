import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import InputMsg from "./InputMsg";
import { userImage } from "../api";

import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import { Avatar, IconButton } from "@material-ui/core";
import { resetActiveChat } from "../actions/chatActions";

const ChatWindow = ({ userId, token }) => {
  const msgsEndRef = useRef(null);
  const activeChat = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  //useEffect for the scrool to the last message
  useEffect(() => {
    if (msgsEndRef.current)
      msgsEndRef.current.scrollIntoView({ behavior: "auto" });
  }, [msgsEndRef, activeChat.messages]);

  const timeZoneChange = (timeStr) => {
    const date = new Date(timeStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    const dateStr = `${day}.${month}.${year}`;
    return `${date.toTimeString().slice(0, 5)} | ${dateStr}`;
  };

  return (
    <ChatContainerStyle>
      {activeChat.isActive && (
        <ChatWindowStyled>
          <IconButton
            size="small"
            className="close-button"
            onClick={() => {
              dispatch(resetActiveChat());
            }}
          >
            <CloseIcon className="close-icon" />
          </IconButton>
          {activeChat.isActive &&
            activeChat.messages &&
            activeChat.messages.map((msg, index) =>
              msg.isInfo ? (
                <div className="info-container" key={msg._id}>
                  <div className="message">
                    <p className="msg-text">{`${
                      userId === msg.sender._id ? "You" : msg.sender.name
                    } ${msg.content}`}</p>
                    <p className="time-stamp">
                      {timeZoneChange(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`msg-container ${
                    userId === msg.sender._id ? "sended" : "recived"
                  }`}
                  key={msg._id}
                >
                  <Avatar
                    src={
                      msg.sender.image &&
                      msg.sender.image.image.length > 0 &&
                      userImage(msg.sender.image.image)
                    }
                    alt={msg.sender.name}
                    className="avatar"
                  />
                  <div className={`message`} key={msg._id}>
                    <p className="name-tag">
                      {userId === msg.sender._id ? "You" : msg.sender.name}
                    </p>
                    <p className="msg-text">{msg.content}</p>
                    <p className="time-stamp">
                      {timeZoneChange(msg.createdAt)}
                    </p>
                  </div>
                </div>
              )
            )}
          <div ref={msgsEndRef}></div>
        </ChatWindowStyled>
      )}
      {activeChat.isActive && (
        <InputMsg chatId={activeChat._id} token={token} />
      )}
    </ChatContainerStyle>
  );
};

export default ChatWindow;

const ChatContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: 95%;
  flex: 0.6;
`;
const ChatWindowStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #f1f2f6;
  width: 100%;

  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  .close-button {
    position: sticky;
    top: 0%;
    left: 100%;
    width: 1.2rem;
    height: 1.2rem;
    font-size: 2rem;
    background: #f1f2f6;
    z-index: 9999;
    &:hover {
      background: #dadada;
    }
  }
  .close-icon {
    font-size: 1.2rem;
  }
  .info-container {
    margin: 0 auto;

    .message {
      box-shadow: none;
      padding: 0.2rem 0.5rem 0 0.5rem;
      margin: 0.3rem 0;
    }
    .msg-text {
      font-weight: 300;
      font-style: italic;
      font-size: 0.9rem;
      padding: 0;
    }
  }
  .msg-container {
    display: flex;
  }
  .name-tag {
    position: absolute;
    top: 0;
    right: 5px;
    font-size: 0.6rem;
    color: #00000067;
  }
  .message {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #55555560;
    border-radius: 10px;
    padding: 0.5rem 0.5rem 0 0.5em;
    margin: 0.5rem 0;
    box-shadow: 0px 1px 4px 1px #55555560;
  }
  .msg-text {
    font-size: 0.9rem;
    padding: 0.2em 0;
  }
  .avatar {
    margin: auto 0.4rem;
    width: 2rem;
    height: 2rem;
  }
  .sended {
    align-self: flex-start;
    .message {
      background: #55efc4;
    }
  }
  .recived {
    align-self: flex-end;
    direction: rtl;
    .message {
      background: #d8a1f8a7;
    }
  }
  .time-stamp {
    padding-top: 0.2em;
    align-self: flex-end;
    color: #00000067;
    font-size: 0.6rem;
  }
`;
