import { requestState, failureState } from "../utils";
const {
  FETCH_TENANTS_REQUEST,
  FETCH_TENANTS_SUCCESS,
  FETCH_TENANTS_FAILURE,
  FETCH_DASHBOARD_TENANTS_REQUEST,
  FETCH_DASHBOARD_TENANTS_SUCCESS,
  FETCH_DASHBOARD_TENANTS_FAILURE,
  POST_TENANT_REQUEST,
  POST_TENANT_SUCCESS,
  POST_TENANT_FAILURE,
} = require("./types");

const initialeState = {
  tenants: [],
  isLoading: false,
  error: null,
};

const successState = (state, action) => {
  return {
    ...state,
    tenants: action.payload,
    isLoading: false,
  };
};

const tenantsReducer = (state = initialeState, action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_TENANTS_REQUEST:
      return requestState(state, true);
    case FETCH_DASHBOARD_TENANTS_SUCCESS:
      return successState(state, action);
    case FETCH_DASHBOARD_TENANTS_FAILURE:
      return failureState(state, action);
    case FETCH_TENANTS_REQUEST:
      return requestState(state, true);
    case FETCH_TENANTS_SUCCESS: {
      return successState(state, action);
    }
    case FETCH_TENANTS_FAILURE:
      return failureState(state, action);
    case POST_TENANT_REQUEST:
      return requestState(state, true);
    case POST_TENANT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case POST_TENANT_FAILURE:
      return failureState(state, action);

    default:
      return state;
  }
};

export default tenantsReducer;
