import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Toggle from "./Toggle";
import { useDispatch, useSelector } from "react-redux";
import { responseMsg, popMsg } from "../actions/popMsgActions";
import {
  addManagerChatURL,
  addUserChatURL,
  changeChatNameURL,
  imageURL,
  leaveChatURL,
  removeManagerChatURL,
  removeUserChatURL,
  uploadChatImageURL,
  userImage,
} from "../api";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import axios from "axios";
import { resetActiveChat } from "../actions/chatActions";
const ChatSettings = ({ token }) => {
  const [selected, setSelected] = useState({});
  const [action, setAction] = useState("");
  const [actionActive, setActionActive] = useState(false);
  const [notMemebers, setNotMembers] = useState([]);
  const friends = useSelector((state) => state.user.friends);
  const userId = useSelector((state) => state.user._id);
  const activeChat = useSelector((state) => state.chat);
  const popMessage = useSelector((state) => state.popMessage);
  const dispatch = useDispatch();
  const [chatName, setChatName] = useState("");
  const [imagePath, setImagePath] = useState("");
  const authHeader = { headers: { "x-auth-token": token } };

  useEffect(() => {
    if (!activeChat.isActive) window.location.assign("/app");
    const removeUser = async () => {
      setActionActive(true);
      const newMembers = await axios.put(
        removeUserChatURL(),
        { chatId: activeChat._id, removeId: selected._id },
        authHeader
      );
      setActionActive(false);
    };
    const addUser = async () => {
      setActionActive(true);
      const newMembers = await axios.put(
        addUserChatURL(),
        { chatId: activeChat._id, addId: selected._id },
        authHeader
      );
      setActionActive(false);
    };
    const leaveChat = async () => {
      setActionActive(true);
      await axios
        .put(leaveChatURL(), { chatId: activeChat._id }, authHeader)
        .then(() => {
          setActionActive(false);
          dispatch(resetActiveChat());
          window.location.assign("/app");
        });
    };
    if (popMessage.response === false) {
      if (popMessage.lastResponse === true) {
        if (selected._id) {
          if (action === "kick") removeUser();
          if (action === "add") addUser();
          setSelected({});
        }
        if (action === "leave") leaveChat();
      }
      setAction("");
    }
  }, [popMessage.response, dispatch]);
  const managerCheck = (id) => {
    const index = activeChat.manager.findIndex((manager) => manager === id);
    return index >= 0;
  };
  const isManager = activeChat.isActive && managerCheck(userId);
  const kickUserHandler = async (friend) => {
    setSelected(friend);
    setAction("kick");
    dispatch(responseMsg(`Kick ${friend.name} from the chat?`));
  };
  const addUserHandler = async (friend) => {
    setSelected(friend);
    setAction("add");
    dispatch(responseMsg(`Add ${friend.name} to the chat?`));
  };
  const leaveChatHandler = (e) => {
    e.preventDefault();
    setAction("leave");
    dispatch(responseMsg(`Sure you want to leave the chat?`));
  };
  const changeChatNameHandler = async (e) => {
    e.preventDefault();
    if (chatName.length > 1) {
      await axios
        .put(
          changeChatNameURL(),
          { chatId: activeChat._id, name: chatName },
          authHeader
        )
        .then((res) => {
          dispatch(popMsg("Chat name changed!"));
        });
    }
  };
  const membersCheck = (id) => {
    const filterd = activeChat.members.filter((member) => member._id === id);
    return filterd.length === 1;
  };
  const imageUploadHandler = async (e) => {
    e.preventDefault();
    if (imagePath) {
      const formData = new FormData();
      formData.append("image", imagePath);
      await axios
        .put(uploadChatImageURL(activeChat._id), formData, authHeader)
        .then((res) => {
          dispatch(popMsg(res.data));
        });
    }
  };

  const addManagerHandler = async (id) => {
    setActionActive(true);
    await axios
      .put(addManagerChatURL(), { chatId: activeChat._id, id: id }, authHeader)
      .then((res) => {
        dispatch(popMsg(res.data));
      });
    setActionActive(false);
  };
  const removeManagerHandler = async (id) => {
    setActionActive(true);
    await axios
      .put(
        removeManagerChatURL(),
        { chatId: activeChat._id, id: id },
        authHeader
      )
      .then((res) => {
        dispatch(popMsg(res.data));
      });
    setActionActive(false);
  };
  return (
    <ChatSettingsStyled>
      <Link to="/app">
        <IconButton className="icon-back">
          <ArrowBackIcon />
        </IconButton>
      </Link>
      {activeChat.isActive && (
        <button className="btn-leave" onClick={leaveChatHandler}>
          Quit Chat
        </button>
      )}
      {activeChat.isActive && (
        <div className="chat-settings-container">
          <div className="image-edit-container">
            <Avatar
              className="image"
              src={
                activeChat.image?.image ? imageURL(activeChat.image.image) : ""
              }
            />
            <Toggle flexDir="column-center">
              <IconButton className="btn-edit" size="small">
                <EditIcon />
              </IconButton>
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

          <div className="settings-options">
            <div className="settings-option">
              <h3 className="chat-name">
                <span className="label">Chat Name:</span>
                {activeChat.name}
              </h3>
              <Toggle flexDir="row">
                <IconButton className="btn-edit" size="small">
                  <EditIcon />
                </IconButton>
                <form className="input-chat-name">
                  <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                  />
                  <IconButton
                    className="btn-edit btn-done"
                    size="small"
                    type="submit"
                    onClick={changeChatNameHandler}
                  >
                    <DoneIcon />
                  </IconButton>
                </form>
              </Toggle>
            </div>
            <div className="settings-option">
              <div className="users-list-container">
                {activeChat.members.map((member) => {
                  return (
                    <div className="user" key={member._id}>
                      <Avatar
                        src={
                          member.image?.image?.length > 0
                            ? userImage(member.image.image)
                            : ""
                        }
                        alt={member.name}
                      />
                      <div className="user-info">
                        <h3>{member._id !== userId ? member.name : "You"}</h3>
                        {isManager && member._id !== userId && (
                          <div className="action">
                            <IconButton
                              className="btn-action"
                              size="small"
                              onClick={() => {
                                kickUserHandler(member);
                              }}
                              disabled={actionActive}
                            >
                              <HighlightOffIcon className="btn-icon icon-kick" />
                            </IconButton>
                            {!managerCheck(member._id) ? (
                              <button
                                className="btn-manager add-manager"
                                onClick={() => {
                                  addManagerHandler(member._id);
                                }}
                                disabled={actionActive}
                              >
                                Add Manager
                              </button>
                            ) : (
                              <button
                                className="btn-manager remove-manager"
                                onClick={() => {
                                  removeManagerHandler(member._id);
                                }}
                                disabled={actionActive}
                              >
                                Remove Manager
                              </button>
                            )}
                          </div>
                        )}
                        <p className="in-chat">
                          {managerCheck(member._id) ? `MANAGER` : `IN CHAT`}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isManager &&
                  friends &&
                  friends.length > 0 &&
                  friends
                    .filter((friend) => !membersCheck(friend._id))
                    .map((friend) => {
                      return (
                        <div className="user" key={friend._id}>
                          <Avatar
                            src={
                              friend.image.image.length > 0
                                ? userImage(friend.image.image)
                                : ""
                            }
                            alt="friend name here"
                          />
                          <div className="user-info">
                            <h3>{friend.name}</h3>
                            {isManager && (
                              <div className="action">
                                <IconButton
                                  className="btn-action"
                                  size="small"
                                  onClick={() => {
                                    addUserHandler(friend);
                                  }}
                                  disabled={actionActive}
                                >
                                  <AddCircleOutlineIcon className="btn-icon icon-add" />
                                </IconButton>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      )}
    </ChatSettingsStyled>
  );
};

const grow = keyframes`
from{
  width:0;
}
to{
  width:100%;
}`;

const fade = keyframes`
from{
  opacity:0;
}
to{
  opacity:1;
}`;
const ChatSettingsStyled = styled.div`
  width: 100%;
  display: flex;
  height: 95%;
  margin: 0 2rem;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  position: relative;
  .btn-done {
    color: green;
  }
  .input-chat-name {
    display: flex;
    align-items: center;
    input {
      animation: ${grow} 1s ease;
      border: none;
      outline-width: 0;
      margin-left: 1rem;
      font-size: 1rem;
      border: 1px solid #6d6d6d3d;
      padding: 0.1em 0.3em;
      border-radius: 5px;
    }
  }

  .icon-back {
    position: absolute;

    left: 1rem;
    top: 1rem;
  }

  .chat-settings-container {
    margin: 2rem;
    width: 100%;
    display: grid;
    grid-template-columns: 30% 70%;
  }
  .image-edit-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .image {
      width: 15rem;
      height: 15rem;
      margin-bottom: 1rem;
    }
    .input-data {
      margin-top: 1rem;
      animation: ${fade} 1s ease;
      .btn-submit {
        background: #07880724;
        font-family: "Rubik", sans-serif;
        cursor: pointer;
        font-weight: 400;
        font-size: 0.7rem;
        border: solid 1px #6d6d6d3d;
        border-radius: 5px;
        padding: 0.2em 0.5em;
        margin-top: 0.5rem;
        transition: background 0.2s ease;
        &:hover {
          background: #07880750;
        }
      }
    }
  }
  .settings-option {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
  }
  .btn-leave {
    font-family: "Rubik", sans-serif;
    position: absolute;
    color: #685858a6;
    background: #fff;
    border: 1px solid #5a36363c;
    border-radius: 4px;
    padding: 0.2em 0.4em;
    cursor: pointer;
    transition: background 0.2s ease;
    &:hover {
      background: #ff000010;
    }
  }
  .btn-edit {
    margin: 0 1rem;
    transition: all 0.5s ease;
    .MuiSvgIcon-root {
      font-size: 1.2rem;
    }
  }
  .chat-name {
    font-weight: 400;
    align-self: center;
    .label {
      font-size: 0.8rem;
      margin-right: 0.5rem;
      color: #6d6d6d;
      border-bottom: 1px solid #6d6d6d3d;
    }
  }
  .users-list-container {
    overflow: scroll;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    padding: 1rem;
  }
  .user {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #6d6d6d3d;
    transition: all 0.2s ease;
    margin-left: 3rem;
    position: relative;
    &:hover {
      background: #6d6d6d15;
    }
  }
  .action {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .in-chat {
    position: absolute;
    font-family: "Rubik", sans-serif;
    right: 0;
    bottom: 0;
    font-size: 0.6rem;
    color: #008f008d;
  }
  .user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    h3 {
      font-size: 1rem;
      margin-bottom: 0.3rem;
      font-weight: 500;
    }
    .icon-kick {
      color: #ff0000a4;
    }
    .icon-add {
      color: green;
    }
    .btn-icon {
      font-size: 1.2rem;
    }
    .btn-manager {
      background: #fff;
      border: 1px solid #6969693d;
      border-radius: 5px;
      font-family: "Rubik", sans-serif;
      font-weight: 300;
      font-size: 0.6rem;
      padding: 0.2em 0.6em;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .add-manager {
      color: green;
      &:hover {
        background: #00800058;
        color: #000;
      }
    }

    .remove-manager {
      color: #6e0000;
      &:hover {
        cursor: pointer;
        background: #80000057;
        color: #000;
      }
    }
  }
  .MuiAvatar-root {
    margin-right: 0.5rem;
    width: 4rem;
    height: 4rem;
  }
`;
export default ChatSettings;
