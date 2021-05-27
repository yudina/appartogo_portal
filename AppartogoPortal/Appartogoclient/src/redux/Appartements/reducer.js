import { requestState, failureState } from "../utils";
import {
  FETCH_APPARTEMENTS_REQUEST,
  FETCH_APPARTEMENTS_SUCCESS,
  FETCH_APPARTEMENTS_FAILURE,
} from "./types";
const initialState = {
  appartements: [],
  isLoading: false,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    appartements: action.payload,
    isLoading: false,
  };
};

const appartementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APPARTEMENTS_REQUEST:
      return requestState(state, true);
    case FETCH_APPARTEMENTS_SUCCESS:
      return successState(state, action);
    case FETCH_APPARTEMENTS_FAILURE:
      return failureState(state, action);

    default:
      return state;
  }
};

export default appartementsReducer;
