import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_ADDRESS_REQUEST,
  FETCH_ADDRESS_SUCCESS,
  FETCH_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
} from "./types";
import AddressService from '../../services/AddressService/index';

const fetchAddressRequest = () => {
  return requestActionCreator(FETCH_ADDRESS_REQUEST);
};

const fetchAddressSuccess = (payload) => {
  return responseActionCreator(FETCH_ADDRESS_SUCCESS, payload);
};

const fetchAddressFailure = (payload) => {
  return responseActionCreator(FETCH_ADDRESS_FAILURE, payload);
};

const updateAddressRequest = () => {
  return requestActionCreator(UPDATE_ADDRESS_REQUEST);
};

const updateAddressSuccess = (payload) => {
  return responseActionCreator(UPDATE_ADDRESS_SUCCESS, payload);
};

const updateAddressFailure = (payload) => {
  return responseActionCreator(UPDATE_ADDRESS_FAILURE, payload);
};

export const updateAddressInformation = (addressInformation) => async (dispatch) => {
  dispatch(updateAddressRequest());
  try {
    const results = await AddressService.updateAddressInfo(addressInformation);
    await dispatch(updateAddressSuccess(results.data));
  } catch (error) {
    await dispatch(updateAddressFailure(error));
  }
};

export const fetchAddressInformation = (addressId) => async (dispatch) => {
  dispatch(fetchAddressRequest());
  try {
    const results = await AddressService.getAddressInfo(addressId);
    await dispatch(fetchAddressSuccess(results.data));
  } catch (error) {
    await dispatch(fetchAddressFailure(error));
  }
};
