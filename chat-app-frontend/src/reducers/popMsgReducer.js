const init = {
  message: "",
  active: false,
  response: false,
  lastResponse: false,
  waitResponse: false,
};

const popMsgReducer = (state = init, action) => {
  switch (action.type) {
    case "POP_MSG": {
      return { ...state, message: action.payload.message, active: true };
    }
    case "RES_POP_MSG": {
      return {
        ...state,
        message: action.payload.message,
        active: true,
        response: true,
      };
    }
    case "CLOSE_MSG": {
      return { ...state, message: "", active: false, response: false };
    }
    case "RES_MSG_TRUE": {
      return {
        ...state,
        lastResponse: true,
      };
    }
    case "RES_MSG_FALSE": {
      return {
        ...state,
        lastResponse: false,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default popMsgReducer;
