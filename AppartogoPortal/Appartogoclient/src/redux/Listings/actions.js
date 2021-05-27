import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_LISTINGS_REQUEST,
  FETCH_LISTINGS_SUCCESS,
  FETCH_LISTINGS_FAILURE,
} from "./types";
import ListingService from "../../services/ListingsService";

const fetchListingsRequest = () => {
  return requestActionCreator(FETCH_LISTINGS_REQUEST);
};

const fetchListingsSuccess = (payload) => {
  return responseActionCreator(FETCH_LISTINGS_SUCCESS, payload);
};

const fetchListingsFailure = (payload) => {
  return responseActionCreator(FETCH_LISTINGS_FAILURE, payload);
};

export const fetchListings = (appartements) => async (dispatch) => {
  dispatch(fetchListingsRequest());
  try {
    if (appartements.length == 0 || !appartements) {
      throw new Error("params is null");
    }
    const result = await ListingService.fetchListings(appartements);
    await dispatch(fetchListingsSuccess(result.data));
  } catch (error) {
    await dispatch(fetchListingsFailure(error));
  }
};
