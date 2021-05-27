import { requestState, failureState } from "../utils";
import {
  FETCH_ADDRESS_REQUEST,
  FETCH_ADDRESS_SUCCESS,
  FETCH_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
} from "./types";

const initialeState = {
  addressInfo: {},
  isLoading: false,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    addressInfo: action.payload,
    isLoading: false,
  };
};

const AddressReducer = (state = initialeState, action) => {
  switch (action.type) {
    case FETCH_ADDRESS_REQUEST:
      return requestState(state, true);
    case FETCH_ADDRESS_SUCCESS:
      return successState(state, action);
    case FETCH_ADDRESS_FAILURE:
      return failureState(state, action);
    case UPDATE_ADDRESS_REQUEST:
      return requestState(state, true);
    case UPDATE_ADDRESS_SUCCESS: {
      return successState(state, action);
    }
    case UPDATE_ADDRESS_FAILURE:
      return failureState(state, action);

    default:
      return state;
  }
};

export default AddressReducer;
