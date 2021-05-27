import {
  FETCH_APPLICATIONS_FAILURE,
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATIONS_SUCCESS,
  UPDATE_APPLICATIONS_REQUEST,
  UPDATE_APPLICATIONS_SUCCESS,
  UPDATE_APPLICATIONS_FAILURE,
  FETCH_DASHBOARD_APPLICATIONS_FAILURE,
  FETCH_DASHBOARD_APPLICATIONS_REQUEST,
  FETCH_DASHBOARD_APPLICATIONS_SUCCESS,
  POST_TENANT_REQUEST,
  POST_TENANT_SUCCESS,
  POST_TENANT_FAILURE
} from "./types";
import { requestState, failureState } from "../utils";

const initialState = {
  applications: [],
  isLoading: false,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    applications: action.payload,
    isLoading: false,
  };
};

const applicationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_APPLICATIONS_REQUEST:
      return requestState(state, true);
    case FETCH_DASHBOARD_APPLICATIONS_SUCCESS:
      return successState(state, action);
    case FETCH_DASHBOARD_APPLICATIONS_FAILURE:
      return failureState(state, action);
    case FETCH_APPLICATIONS_REQUEST:
      return requestState(state, true);
    case FETCH_APPLICATIONS_SUCCESS:
      return successState(state, action);
    case FETCH_APPLICATIONS_FAILURE:
      return failureState(state, action);
    case UPDATE_APPLICATIONS_REQUEST:
      return requestState(state, false);
    case UPDATE_APPLICATIONS_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        applications: state.applications.map((applications) =>
          applications.id === payload.id ? payload : applications
        ),
        isLoading: false,
      };
    }
    case UPDATE_APPLICATIONS_FAILURE:
      return failureState(state, action);
    

    default:
      return state;
  }
};

export default applicationsReducer;
