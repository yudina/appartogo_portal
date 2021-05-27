import { FETCH_PROPERTIES_REQUEST, FETCH_PROPERTIES_SUCCESS, FETCH_PROPERTIES_FAILURE } from "./types";
import { requestState, failureState } from "../utils";
const initialState = {
  properties: [],
  isLoading: false,
  propertiesCounter: 0,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    properties: action.payload,
    propertiesCounter: action.payload.length,
    isLoading: false,
  };
};

const propertyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROPERTIES_REQUEST:
      return requestState(state, true);
    case FETCH_PROPERTIES_SUCCESS:
      return successState(state, action);
    case FETCH_PROPERTIES_FAILURE:
      return failureState(state, action);

    default:
      return state;
  }
};

export default propertyReducer;
