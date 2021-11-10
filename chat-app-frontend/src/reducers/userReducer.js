const initState = {
  _id: "",
  name: "",
  chats: [],
  friends: [],
  requests: [],
  token: "",
  image: "",
  notifications: [],
  alert: {},
  active: false,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "USER_LOGIN": {
      return {
        ...state,
        token: action.payload.token,
        active: true,
        _id: action.payload._id,
        name: action.payload.name,
        friends: action.payload.friends,
        requests: action.payload.requests,
        chats: action.payload.chats,
        image: action.payload.image,
        notifications: action.payload.notifications,
        alert: action.payload.alert,
      };
    }
    case "USER_UPDATE_TOKEN": {
      return {
        ...state,
        name: action.payload.name,
        _id: action.payload._id,
        token: action.payload.token,
      };
    }

    case "UPDATE_CHATS": {
      return { ...state, chats: action.payload.chats };
    }
    case "CHAT_ADDED": {
      const chats = [action.payload.chat, ...state.chats];
      return { ...state, chats: [...chats] };
    }
    case "UPDATE_LAST_MESSAGE": {
      const chats = state.chats.map((chat) => {
        if (chat._id === action.payload.chatId) {
          chat.lastMessage = action.payload.message;
        }
        return chat;
      });

      return { ...state, chats: [...chats] };
    }
    case "UPDATE_NOTIFICATIONS": {
      return { ...state, notifications: [...action.payload.notifications] };
    }
    case "UPDATE_REQUESTS": {
      return { ...state, requests: [...action.payload.requests] };
    }
    case "UPDATE_ALERT": {
      console.log("in user alert reducer");
      return { ...state, alert: action.payload.alert };
    }
    case "FRIENDS_UPDATE": {
      return { ...state, friends: action.payload.friends };
    }
    case "REQUESTS_UPDATE": {
      return { ...state, requests: action.payload.requests };
    }
    case "USER_LOGOUT": {
      return { ...initState };
    }
    case "IMAGE_UPDATE": {
      return { ...state, image: action.payload.image };
    }
    default: {
      return { ...state };
    }
  }
};

export default userReducer;
