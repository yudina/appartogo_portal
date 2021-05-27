import { requestState, failureState } from "../utils";
import {
  FETCH_LISTINGS_REQUEST,
  FETCH_LISTINGS_SUCCESS,
  FETCH_LISTINGS_FAILURE,
} from "./types";

const initialState = {
  listings: [],
  isLoading: false,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    listings: action.payload,
    isLoading: false,
  };
};

const listingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LISTINGS_REQUEST:
      return requestState(state, true);
    case FETCH_LISTINGS_SUCCESS:
      return successState(state, action);
    case FETCH_LISTINGS_FAILURE:
      return failureState(state, action);

    default:
      return state;
  }
};

export default listingsReducer;
