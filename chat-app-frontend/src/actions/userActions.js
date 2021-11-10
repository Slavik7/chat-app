import axios from "axios";
import {
  auth,
  getFriends,
  getRequests,
  tokenAuth,
  getUserImage,
  getChats,
  userAlertUpdate,
} from "../api";

export const userLogin = (email, password) => async (dispatch) => {
  const userData = await axios.post(auth(), {
    email: email,
    password: password,
  });
  if (userData) {
    localStorage.setItem("userToken", JSON.stringify(userData.data.token));
    dispatch({
      type: "USER_LOGIN",
      payload: {
        name: userData.data.name,
        _id: userData.data._id,
        token: userData.data.token,
        friends: userData.data.friends,
        requests: userData.data.requests,
        chats: userData.data.chats,
        image: userData.data.image,
        notifications: userData.data.notifications,
        alert: userData.data.alert,
      },
    });
  }
};

export const userLogout = () => {
  localStorage.removeItem("userToken");
  return { type: "USER_LOGOUT" };
};

export const userUpdateToken = (user) => {
  localStorage.removeItem("userToken");
  localStorage.setItem("userToken", JSON.stringify(user.token));
  return {
    type: "USER_UPDATE_TOKEN",
    payload: {
      name: user.name,
      _id: user._id,
      token: user.token,
    },
  };
};
export const userLoginByToken = (token) => async (dispatch) => {
  const userData = await axios.post(
    tokenAuth(),
    {},
    {
      headers: { "x-auth-token": token },
    }
  );
  dispatch({
    type: "USER_LOGIN",
    payload: {
      name: userData.data.name,
      _id: userData.data._id,
      token: userData.data.token,
      friends: userData.data.friends,
      requests: userData.data.requests,
      image: userData.data.image,
      chats: userData.data.chats,
      notifications: userData.data.notifications,
      alert: userData.data.alert,
    },
  });
};

export const friendsUpdate = (token) => async (dispatch) => {
  const friendsData = await axios.get(getFriends(), {
    headers: { "x-auth-token": token },
  });
  if (friendsData) {
    dispatch({
      type: "FRIENDS_UPDATE",
      payload: { friends: friendsData.data },
    });
  }
};

export const requestsUpdate = (token) => async (dispatch) => {
  const reqsData = await axios.get(getRequests(), {
    headers: { "x-auth-token": token },
  });
  if (reqsData) {
    dispatch({ type: "REQUESTS_UPDATE", payload: { requests: reqsData.data } });
  }
};

export const updateUserImage = (token) => async (dispatch) => {
  const reqsData = await axios.get(getUserImage(), {
    headers: { "x-auth-token": token },
  });
  if (reqsData)
    dispatch({ type: "IMAGE_UPDATE", payload: { image: reqsData.data.image } });
};

export const updateLastMessage = (chatId, msg) => {
  return {
    type: "UPDATE_LAST_MESSAGE",
    payload: { message: msg, chatId: chatId },
  };
};
export const updateUserChats = (token) => async (dispatch) => {
  const chats = await axios.get(getChats(), {
    headers: { "x-auth-token": token },
  });
  if (chats) dispatch({ type: "UPDATE_CHATS", payload: { chats: chats.data } });
};
export const updateChatAdd = (chat) => {
  return {
    type: "CHAT_ADDED",
    payload: { chat: chat },
  };
};
export const updateNotifications = (notifications) => {
  return {
    type: "UPDATE_NOTIFICATIONS",
    payload: { notifications: notifications },
  };
};
export const updateRequests = (requests) => {
  return {
    type: "UPDATE_REQUESTS",
    payload: { requests: requests },
  };
};

export const updateAlert = (alert) => {
  console.log("in update alert" + alert);
  return {
    type: "UPDATE_ALERT",
    payload: { alert: alert },
  };
};

export const updateAlertFS = (alert, token) => async (dispatch) => {
  console.log("in update alert FS" + alert);
  await axios.put(
    userAlertUpdate(),
    { alert: alert },
    {
      headers: { "x-auth-token": token },
    }
  );
  console.log("in update alert FS2" + alert);
  dispatch({ type: "UPDATE_ALERT", payload: { alert: alert } });
};
