const initState = {
  _id: "",
  name: "",
  messages: [],
  manager: [],
  image: {},
  lastMessage: {},
  isActive: false,
};

const chatReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_ACTIVE_CHAT": {
      return { ...state, ...action.payload.chat, isActive: true };
    }
    case "UPDATE_MESSAGES": {
      return { ...state, messages: action.payload.messages };
    }
    case "REAL_TIME_MSG": {
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    }
    case "UPDATE_CHAT": {
      return {
        ...state,
        ...action.payload.chat,
      };
    }
    case "UPDATE_IMAGE": {
      return {
        ...state,
        image: action.payload.image,
      };
    }
    case "UPDATE_MEMBERS": {
      return { ...state, members: action.payload.members };
    }
    case "RESET_CHAT": {
      return { ...initState };
    }
    default: {
      return { ...state };
    }
  }
};

export default chatReducer;
