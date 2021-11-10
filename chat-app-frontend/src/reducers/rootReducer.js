import { combineReducers } from "redux";
import popMsgReducer from "./popMsgReducer";
import userReducer from "./userReducer";
import chatReducer from "./chatReducer";

export default combineReducers({
  user: userReducer,
  chat: chatReducer,
  popMessage: popMsgReducer,
});
