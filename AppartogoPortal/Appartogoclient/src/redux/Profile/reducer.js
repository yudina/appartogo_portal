import { requestState, failureState } from "../utils";
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "./types";

const initialeState = {
  profileInfo: {},
  isLoading: false,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    profileInfo: action.payload,
    isLoading: false,
  };
};

const profileReducer = (state = initialeState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
      return requestState(state, true);
    case FETCH_PROFILE_SUCCESS:
      return successState(state, action);
    case FETCH_PROFILE_FAILURE:
      return failureState(state, action);
    case UPDATE_PROFILE_REQUEST:
      return requestState(state, true);
    case UPDATE_PROFILE_SUCCESS: {
      return successState(state, action);
    }
    case UPDATE_PROFILE_FAILURE:
      return failureState(state, action);

    default:
      return state;
  }
};

export default profileReducer;
