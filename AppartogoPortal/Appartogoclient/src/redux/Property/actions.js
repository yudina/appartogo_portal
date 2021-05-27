import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_FAILURE,
  FETCH_PROPERTIES_REQUEST,
} from "./types";
import PropertyService from "../../services/PropertyService/index";

const fetchPropertiesRequest = () => {
  return requestActionCreator(FETCH_PROPERTIES_REQUEST);
};

const fetchPropertiesSuccess = (payload) => {
  return responseActionCreator(FETCH_PROPERTIES_SUCCESS, payload);
};

const fetchPropertiesFailure = (payload) => {
  return responseActionCreator(FETCH_PROPERTIES_FAILURE, payload);
};

export const fetchProperties = (organizationId) => async (dispatch) => {
  dispatch(fetchPropertiesRequest());
  try {
    const result = await PropertyService.fetchProperties(organizationId);
    /*if(Object.keys(organization).length === 0 && organization.constructor === Object) {
      throw new Error("params is null");
    }*/
    await dispatch(fetchPropertiesSuccess(result.data));
  } catch (error) {
    await dispatch(fetchPropertiesFailure(error));
  }
};
