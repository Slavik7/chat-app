import styled, { keyframes } from "styled-components";
import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Avatar, IconButton } from "@material-ui/core";
import axios from "axios";
import { acceptRequest, findUsers, sendFriendRequest, userImage } from "../api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { friendsUpdate, requestsUpdate } from "../actions/userActions";
import { popMsg } from "../actions/popMsgActions";
const AddFriends = ({ user }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const dispatch = useDispatch();
  const searchHandler = async () => {
    const users = await axios.get(findUsers(searchText), {
      headers: { "x-auth-token": user.token },
    });
    if (users.data) {
      const filterUsers = users.data
        .map((u) => {
          if (u._id != user._id) {
            if (ifInFriendsList(u._id)) {
              return {
                ...u,
                isFriend: true,
              };
            } else
              return {
                ...u,
                isFriend: false,
              };
          }
        })
        .filter((u) => u); //filtering the undifiend
      setSearchedUsers([...filterUsers]);
    }
  };

  const addFriendHandler = async (userToAdd) => {
    const index = user.requests.findIndex((u) => u._id === userToAdd._id);
    if (index === -1)
      await axios
        .post(
          sendFriendRequest(),
          { id: userToAdd._id },
          {
            headers: { "x-auth-token": user.token },
          }
        )
        .then((res) => {
          dispatch(popMsg(res.data));
        })
        .catch((error) => {
          dispatch(popMsg("Error with the data, friend request not sended"));
        });
    else {
      await axios
        .post(
          acceptRequest(),
          { id: userToAdd._id },
          {
            headers: { "x-auth-token": user.token },
          }
        )
        .then((res) => {
          dispatch(popMsg("Friend Request Accepted"));
        });
    }
    //update the friends and request list;
    dispatch(friendsUpdate(user.token));
    dispatch(requestsUpdate(user.token));
  };
  const ifInFriendsList = (id) => {
    const arr = user.friends.filter((friend) => friend._id === id);
    return arr.length > 0;
  };
  return (
    <AddFriendsStyle>
      <Link to="/app">
        <IconButton className="icon-back">
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <h3>Search and Add Friends</h3>
      <form className="search-container">
        <input
          type="text"
          placeholder="search for users"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          value={searchText}
        ></input>
        <IconButton
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            searchHandler();
          }}
        >
          <SearchIcon />
        </IconButton>
      </form>
      <div className="users-list-container">
        {searchedUsers &&
          searchedUsers.length > 0 &&
          searchedUsers.map((searchedUser) => {
            return (
              <div className="user" key={searchedUser._id}>
                <Avatar
                  src={
                    searchedUser.image.image.length > 0
                      ? userImage(searchedUser.image.image)
                      : ""
                  }
                  alt="friend name here"
                />
                <div className="user-info">
                  <h3>{searchedUser.name}</h3>

                  <button
                    className={searchedUser.isFriend ? "btn-none" : "btn-add"}
                    onClick={() => {
                      addFriendHandler(searchedUser);
                    }}
                  >
                    + Add Friend
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </AddFriendsStyle>
  );
};

export default AddFriends;

const fadeOut = keyframes`
0%{
  display: 1;
}
100%{
  display: 0;
}
`;

const AddFriendsStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 95%;
  padding-top: 2rem;
  margin: 0 2rem;
  align-items: center;
  position: relative;
  .icon-back {
    position: absolute;
    left: 1rem;
    top: 1rem;
  }
  h3 {
    font-weight: 400;
    margin: 0.5rem;
  }
  input {
    flex: 1;
    font-size: 0.9rem;
    border-radius: 10px;
    border: 1px solid #6d6d6d3d;
    outline-width: 0;
    padding: 0.1rem 1rem;
  }
  .search-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30%;
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
    padding: 0.8rem;
    border-bottom: 1px solid #6d6d6d3d;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 3rem;
    &:hover {
      background: #6d6d6d15;
    }
  }
  .user-info {
    h3 {
      font-size: 1rem;
      margin-bottom: 0.3rem;
      font-weight: 500;
    }
    button {
      font-weight: 300;
      border: 1px solid #6d6d6d3d;
      background: none;
      padding: 0.3em;
      border-radius: 10px;
      cursor: pointer;
      &:hover {
        background: #b4dab4;
      }
    }
    .btn-none {
      display: none;
    }
  }
  .MuiAvatar-root {
    margin-right: 0.5rem;
    width: 4rem;
    height: 4rem;
  }
`;
