import React from "react";
import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import { imageURL } from "../api";
import { setActiveChat } from "../actions/chatActions";
import ForumIcon from "@material-ui/icons/Forum";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";

const ChatRooms = ({ token }) => {
  const activeChat = useSelector((state) => state.chat);
  const chats = useSelector((state) => state.user.chats);
  const dispatch = useDispatch();
  const setActiveChatHandler = (chat) => {
    if (activeChat._id !== chat._id) {
      dispatch(setActiveChat(chat, token));
    }
  };
  return (
    <ChatRoomsContainerStyled>
      <div className="chat-rooms__header">
        <h3>Chat Rooms</h3>
        <div className="new-chat">
          <Link to="app/chat/new">
            <Button size="small">
              <ForumIcon />
            </Button>
          </Link>
          <p>New Chat</p>
        </div>
      </div>
      {chats.map((chat) => (
        <div
          className={`chat-room ${
            activeChat.isActive && activeChat._id === chat._id ? "active" : ""
          }`}
          key={chat._id}
          onClick={() => {
            setActiveChatHandler(chat, token);
          }}
        >
          <Avatar
            src={
              chat.image && chat.image.image ? imageURL(chat.image.image) : ""
            }
            alt={chat.name}
          />
          <div className="chat-room__info">
            <h3>{chat.name}</h3>
            <p className="last-msg">
              <span>{`last: `}</span>
              <br></br>
              {chat.lastMessage
                ? `${
                    chat.lastMessage.content.length >= 20
                      ? chat.lastMessage.content.slice(0, 20) + "..."
                      : chat.lastMessage.content
                  }`
                : ""}
            </p>
          </div>
          <div className="btn-settings">
            <Link to="/app/chat/settings">
              <IconButton size="small">
                <SettingsApplicationsIcon className="settings-icon" />
              </IconButton>
            </Link>
            <p className="btn-settings-tag"></p>
          </div>
        </div>
      ))}
    </ChatRoomsContainerStyled>
  );
};

export default ChatRooms;

const ChatRoomsContainerStyled = styled.div`
  padding: 1rem;
  height: 95%;
  width: 100%;
  flex: 0.2;

  .chat-rooms__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid #536ee65e;
    width: 100%;
    h3 {
      font-weight: 400;
    }
    .new-chat {
      position: relative;
      &:hover {
        p {
          opacity: 1;
        }
      }
      p {
        width: 100%;
        text-align: center;
        opacity: 0;
        position: absolute;
        font-size: 0.6rem;
        transition: opacity 0.2s ease;
      }
    }
  }
  .active {
    background: #6d6d6d1a;
    .btn-settings {
      visibility: visible;
    }
    .chat-room__info {
      .last-msg {
        opacity: 0;
      }
    }
  }
  .btn-settings {
    visibility: hidden;

    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
    .settings-icon {
      font-size: 1.3rem;
    }
  }
  .chat-room {
    position: relative;
    display: flex;
    padding: 0.8rem;
    border-bottom: 1px solid #6d6d6d3d;
    transition: all 0.2s ease;
    cursor: pointer;
    &:hover {
      background: #6d6d6d3d;
    }
    .MuiAvatar-root {
      margin-right: 0.5rem;
      width: 4rem;
      height: 4rem;
    }
    .chat-room__info {
      h3 {
        font-size: 1rem;
        margin-bottom: 0.3rem;
        font-weight: 500;
      }
      .last-msg {
        font-weight: 400;
        font-size: 0.7rem;
        span {
          font-size: 0.6rem;
        }
      }
    }
  }
`;
