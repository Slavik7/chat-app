import { Avatar, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "axios";
import { Link } from "react-router-dom";
import { newChat } from "../api";
import { popMsg } from "../actions/popMsgActions";
const NewChat = ({ token }) => {
  const dispatch = useDispatch();
  const [chatName, setChatName] = useState("");
  const friends = useSelector((state) => state.user.friends);
  const [selected, setSelected] = useState(
    Array.from(Array(friends.length)).fill(false)
  );
  const selectHandler = (index) => {
    setSelected((state) => {
      const newState = [...state];
      newState[index] = !newState[index];
      return [...newState];
    });
  };
  const createHandler = async (e) => {
    e.preventDefault();
    if (selected.every((el) => el === false))
      dispatch(popMsg("need to select at least one friend"));
    else if (chatName.length === 0) dispatch(popMsg("need to name the chat"));
    else {
      const theChat = {
        name: chatName,
        members: friends.reduce((filterd, friend, ind) => {
          if (selected[ind]) filterd.push(friend._id);
          return filterd;
        }, []),
      };
      const chat = await axios
        .post(newChat(), theChat, {
          headers: { "x-auth-token": token },
        })
        .then((res) => {
          dispatch(popMsg("Chat Created"));
        });
    }
  };
  return (
    <NewChatStyled>
      <Link to="/app">
        <IconButton className="icon-back">
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <label>
        <p>Chat Name:</p>
        <input
          type="text"
          placeholder="chat name here"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        ></input>
        <button onClick={createHandler} type="submit">
          Create
        </button>{" "}
      </label>
      <div className="friends">
        <h2>Select Friends...</h2>
        {friends.map((friend, friendIndex) => {
          return (
            <div
              onClick={() => selectHandler(friendIndex)}
              className={`friend ${selected[friendIndex] ? "selected" : ""}`}
              key={friend._id}
            >
              <Avatar alt={friend.name} />
              <h3>{friend.name}</h3>
              <CheckIcon className="check-icon" />
            </div>
          );
        })}
      </div>
    </NewChatStyled>
  );
};

export default NewChat;

const NewChatStyled = styled.div`
  width: 100%;
  height: 95%;
  margin: 0 2rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .icon-back {
    position: absolute;

    left: 1rem;
    top: 1rem;
  }
  label {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    p {
      font-size: 1rem;
    }
    input {
      margin: 0 1rem;
      padding: 0.2rem;
      outline-width: 0;
      border-radius: 10px;
      border: solid 1px #6d6d6d3d;
    }
    button {
      font-family: "Rubik", sans-serif;
      font-weight: 400;
      color: #0000009d;
      background: #07880724;
      border: none;
      font-size: 0.8rem;
      padding: 0.3em 0.5em;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        background: #07880750;
        color: #000000;
      }
    }
  }
  .friends {
    border: solid 1px #6d6d6d3d;
    max-width: 80%;
    max-height: 85%;
    h2 {
      width: 100%;
      text-align: center;
      font-size: 1.1rem;
      font-weight: 300;
      padding: 0.5rem 0;
    }
    .friend {
      display: flex;
      align-items: center;
      padding: 1rem;
      padding-right: 1.5rem;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;

      &:hover {
        background: #6d6d6d3d;
      }
      h3 {
        padding: 0 1rem;
        font-weight: 400;
      }
      .check-icon {
        position: absolute;
        right: 0.5rem;
        width: 1rem;
        color: #6d6d6d3d;
      }
    }
    .selected {
      background: #6d6d6d13;
      .check-icon {
        color: #078807;
      }
    }
  }
`;
