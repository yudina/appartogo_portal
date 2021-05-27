import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_ORGANISATION_REQUEST,
  FETCH_ORGANISATION_SUCCESS,
  FETCH_ORGANISATION_FAILURE,
} from "./types";
import OrganizationService from "../../services/OrganizationService/index";

const fetchOrganisationRequest = () => {
  return requestActionCreator(FETCH_ORGANISATION_REQUEST);
};

const fetchOrganisationSuccess = (payload) => {
  return responseActionCreator(FETCH_ORGANISATION_SUCCESS, payload);
};

const fetchOrganistionFailure = (payload) => {
  return responseActionCreator(FETCH_ORGANISATION_FAILURE, payload);
};

export const fetchOrganisation = (accountId) => async (dispatch) => {
  dispatch(fetchOrganisationRequest());
  try {
    if (accountId == null) {
      throw new Error("params is null");
    }
    const result = await OrganizationService.fetchOrganisation(accountId);
    await dispatch(fetchOrganisationSuccess(result.data[0]));
  } catch (error) {
    await dispatch(fetchOrganistionFailure(error));
  }
};
