import * as requestService from "../RequestService/index";


const getAddressInfo = async (addressId) => {
  return await requestService.fetchRequest(`Address/byaccountid/?${addressId}`);
}

const updateAddressInfo = async (addressInformation) => {
  return await requestService.putRequest(`Address/byaccountid/?${accountId}`, addressInformation);
}

const fetchAddress = async (addressId) => {
  return await requestService.fetchRequest(`Address/${addressId}`);
}

const updateAddress = async (address) => {
  return await requestService.putRequest(`Address/`, address);
}

const createAddress = async (address) => {
  return await requestService.postRequest(`Address/`, address);
}


export default { getAddressInfo, updateAddressInfo, fetchAddress, updateAddress, createAddress };
