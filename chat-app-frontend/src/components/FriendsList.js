import React, { useEffect } from "react";
import styled from "styled-components";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar, Button, IconButton } from "@material-ui/core";
import { useState } from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import Toggle from "./Toggle";
import axios from "axios";
import { deleteFriend, userImage } from "../api";
import { friendsUpdate } from "../actions/userActions";
import { useDispatch } from "react-redux";
import { popMsg } from "../actions/popMsgActions";
// need to get all friends and render them

const FriendsList = ({ friends, token }) => {
  const [searchText, setSearchText] = useState("");
  const [searchFriends, setSearchFriends] = useState([...friends]);
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (searchText === "") setSearchFriends([...friends]);
    else
      setSearchFriends([
        ...friends.filter((friend) => {
          const name = friend.name.toLowerCase();
          return name.search(searchText.toLowerCase()) != -1;
        }),
      ]);
  }, [searchText]);
  useEffect(() => {
    setSearchFriends([...friends]);
  }, [friends]);
  const deleteFriendHandler = async (id) => {
    setDeleting(true);
    const res = await axios
      .post(deleteFriend(), { id: id }, { headers: { "x-auth-token": token } })
      .then((res) => {
        dispatch(friendsUpdate(token));
        dispatch(popMsg("friend deleted"));
      });
    setDeleting(false);
  };
  return (
    <FriendListStyled>
      <div className="friends-list__header">
        <div className="friends-list__search">
          <SearchIcon />
          <input
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            value={searchText}
            placeholder="search friends"
            type="text"
          />
        </div>
      </div>

      <div className="friends-container">
        {searchFriends &&
          searchFriends.map((friend, i) => {
            return (
              <div className="friend-container" key={friend._id}>
                <Toggle>
                  <div className="friend">
                    <Avatar
                      src={
                        friend.image.image.length > 0
                          ? userImage(friend.image.image)
                          : ""
                      }
                      alt={friend.name}
                    />
                    <div className="friend-info">
                      <h3>{friend.name}</h3>
                    </div>
                  </div>

                  <div className="friend-options">
                    <Toggle className="delete-toggle">
                      <IconButton className="icon-delete">
                        <DeleteForeverIcon />
                      </IconButton>
                      <div className="confirm-delete">
                        <p>Delete friend?</p>
                        <Button
                          size="small"
                          className="delete-yes"
                          onClick={() => deleteFriendHandler(friend._id)}
                          disabled={deleting}
                        >
                          Yes
                        </Button>
                      </div>
                    </Toggle>
                  </div>
                </Toggle>
              </div>
            );
          })}
      </div>
    </FriendListStyled>
  );
};

export default FriendsList;

const FriendListStyled = styled.div`
  padding: 1rem;
  height: 90%;
  width: 100%;
  flex: 0.2;
  position: relative;

  .friends-container {
    overflow: scroll;
    height: 100%;
  }
  .friends-list__search {
    display: flex;
    align-items: center;
    width: 100%;
    input {
      border: none;
      outline-width: 0;
      font-size: 1rem;
      margin-left: 0.2rem;
      width: 100%;
    }
    .MuiSvgIcon-root {
      color: #bebebe;
    }
  }
  .friend-container {
    border-bottom: 1px solid #6d6d6d3d;
    .friend-options {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .confirm-delete {
        position: absolute;
        text-align: center;
        background: #fff;
        left: 0px;
        top: 0px;
        width: 100%;
        margin-top: -0.5rem;
        p {
          margin-bottom: 0.2rem;
        }
        .delete-yes {
          font-family: "Rubik", sans-serif;
          font-weight: 400;
          width: 100%;
          padding: 0.2em;
          background: #ff000058;
          &:hover {
            background: #ff000090;
          }
        }
      }
    }
    .friend {
      display: flex;
      padding: 0.8rem;

      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        background: #6d6d6d3d;
      }
      .MuiAvatar-root {
        margin-right: 0.5rem;
        width: 4rem;
        height: 4rem;
        background: #6d6d6d15;
      }
      .friend-info {
        display: flex;
        margin-left: 0.5rem;
        align-items: center;
        h3 {
          font-size: 1rem;
          margin-bottom: 0.3rem;
          font-weight: 500;
        }
        p {
          font-weight: 300;
        }
      }
    }
  }
`;
