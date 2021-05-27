import { combineReducers } from "redux";
import chatReducer from "./Chat/reducer";

export const rootReducer = combineReducers({
  chat: chatReducer,
});
