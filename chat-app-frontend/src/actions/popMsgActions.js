export const popMsg = (message) => {
  return {
    type: "POP_MSG",
    payload: {
      message: message,
    },
  };
};

export const responseMsg = (message) => {
  return { type: "RES_POP_MSG", payload: { message: message } };
};
export const responseMsgTrue = () => {
  return { type: "RES_MSG_TRUE" };
};

export const responseMsgFalse = () => {
  return { type: "RES_MSG_FALSE" };
};
export const closeMsg = () => {
  return { type: "CLOSE_MSG" };
};
