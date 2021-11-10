import axios from "axios";
import { getChatImage, getChatMembersURL, getChatMessages } from "../api";

export const setActiveChat = (chat, token) => async (dispatch) => {
  const chatMsgs = await axios.get(getChatMessages(chat._id), {
    headers: { "x-auth-token": token },
  });
  const chatMembers = await axios.get(getChatMembersURL(chat._id), {
    headers: { "x-auth-token": token },
  });
  dispatch({
    type: "SET_ACTIVE_CHAT",
    payload: {
      chat: {
        ...chat,
        messages: chatMsgs ? chatMsgs.data : [],
        members: chatMembers ? chatMembers.data : [],
      },
    },
  });
};

export const updateChatMessages = (id, token) => async (dispatch) => {
  const chatMsgs = await axios.get(getChatMessages(id), {
    headers: { "x-auth-token": token },
  });
  if (chatMsgs)
    dispatch({
      type: "UPDATE_MESSAGES",
      payload: { messages: chatMsgs.data },
    });
};
export const updateChatImage = (id, token) => async (dispatch) => {
  const chatImage = await axios.get(getChatImage(id), {
    headers: { "x-auth-token": token },
  });
  if (chatImage) {
    dispatch({
      type: "UPDATE_IMAGE",
      payload: { image: chatImage.data },
    });
  }
};

export const updateRealTimeMessage = (msg) => {
  return { type: "REAL_TIME_MSG", payload: { message: msg } };
};
export const resetActiveChat = () => {
  return { type: "RESET_CHAT" };
};

export const updateChatMembers = (members) => {
  return { type: "UPDATE_MEMBERS", payload: { members: members } };
};

export const updateActiveChat = (chat) => {
  return { type: "UPDATE_CHAT", payload: { chat: chat } };
};
