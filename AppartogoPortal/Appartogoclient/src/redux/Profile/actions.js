import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "./types";

const fetchProfileRequest = () => {
  return requestActionCreator(FETCH_PROFILE_REQUEST);
};

const fetchProfileSuccess = (payload) => {
  return responseActionCreator(FETCH_PROFILE_SUCCESS, payload);
};

const fetchProfileFailure = (payload) => {
  return responseActionCreator(FETCH_PROFILE_FAILURE, payload);
};

const updateProfileRequest = () => {
  return requestActionCreator(UPDATE_PROFILE_REQUEST);
};

const updateProfileSuccess = (payload) => {
  return responseActionCreator(UPDATE_PROFILE_SUCCESS, payload);
};

const updateProfileFailure = (payload) => {
  return responseActionCreator(UPDATE_PROFILE_FAILURE, payload);
};

export const updateProfileInformation = (profileInformation) => async (dispatch) => {
  dispatch(updateProfileRequest());
  try {
    const results = await Profileservice.updateProfileInfo(profileInformation);
    await dispatch(updateProfileSuccess(results.data));
  } catch (error) {
    await dispatch(updateProfileFailure(error));
  }
};

export const fetchProfileInformation = (accountId) => async (dispatch) => {
  dispatch(fetchProfileRequest());
  try {
    const results = await Profileservice.getProfileInfo(accountId);
    await dispatch(fetchProfileSuccess(results.data));
  } catch (error) {
    await dispatch(fetchProfileFailure(error));
  }
};
