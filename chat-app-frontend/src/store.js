import { applyMiddleware, compose } from "redux";
import { createStore } from "redux";
import userReducer from "./reducers/userReducer";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

const composeEnchancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnchancer(applyMiddleware(thunk))
);

export default store;
