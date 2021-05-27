import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_APPARTEMENTS_REQUEST,
  FETCH_APPARTEMENTS_SUCCESS,
  FETCH_APPARTEMENTS_FAILURE,
} from "./types";
import AppartementsService from "../../services/AppartementsService/index";

const fetchAppartementsRequest = () => {
  return requestActionCreator(FETCH_APPARTEMENTS_REQUEST);
};

const fetchAppartementsSuccess = (payload) => {
  return responseActionCreator(FETCH_APPARTEMENTS_SUCCESS, payload);
};

const fetchAppartementsFailure = (payload) => {
  return responseActionCreator(FETCH_APPARTEMENTS_FAILURE, payload);
};

export const fetchAppartements = (properties) => async (dispatch) => {
  dispatch(fetchAppartementsRequest());
  try {
    if (properties.length == 0 || !properties) {
      throw new Error("params is null");
    }
    const result = await AppartementsService.fetchAppartments(properties);
    await dispatch(fetchAppartementsSuccess(result.data));
  } catch (error) {
    await dispatch(fetchAppartementsFailure(error));
  }
};
