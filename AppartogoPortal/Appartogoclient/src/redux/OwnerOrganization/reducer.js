import { requestState, failureState } from "../utils";
import {
  FETCH_ORGANISATION_REQUEST,
  FETCH_ORGANISATION_SUCCESS,
  FETCH_ORGANISATION_FAILURE,
} from "./types";

const initialState = {
  organization: {},
  isLoading: false,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    organization: action.payload,
    isLoading: false,
  };
};

const ownerOrganizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORGANISATION_REQUEST:
      return requestState(state, true);
    case FETCH_ORGANISATION_SUCCESS:
      return successState(state, action);
    case FETCH_ORGANISATION_FAILURE:
      return failureState(state, action);

    default:
      return state;
  }
};

export default ownerOrganizationReducer;
