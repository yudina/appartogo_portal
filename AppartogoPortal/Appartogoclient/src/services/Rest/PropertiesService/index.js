import axios from "axios";
import * as requestService from "../../RequestService";

const url = "/Property/";
//const organizationId = "cd5ffc7e-8825-eb11-9b7b-ac2b6e5be0f9";
let organizationId = "";

const { REACT_APP_DEV_OWNER_ADDRESS_PATH, REACT_APP_DEV_OWNER_APPARTEMENTS_PATH } = process.env;

export const getProperties = () => {
  return axios.get(url);
};

export const setOrganizationId = async (accountId) => {
  const { data: orgAccounts } = await axios.get(`/OrganizationAccount/byaccountid/${accountId}`);

  if (orgAccounts === undefined || orgAccounts.length === 0) {
    return false;
  }
  else {
    const orgId = orgAccounts[0].organizationId;
    organizationId = orgId;
    return true;
  }
  
}

const fetchAddress = async (properties) => {
  const addressesId = properties.map(property => property.addressId);
  const queryParams = new URLSearchParams();
  for (const addressId of addressesId) {
    queryParams.append("ids", addressId);
  }
  const url = `${REACT_APP_DEV_OWNER_ADDRESS_PATH}?${queryParams.toString()}`
  return await requestService.fetchRequest(url);
};

const fetchAppartments = async (properties) => {
  const propertiesId = properties.map((property) => property.id);
  const queryParams = new URLSearchParams();
  for (const propertyId of propertiesId) {
    queryParams.append("ids", propertyId);
  }
  const url = `${REACT_APP_DEV_OWNER_APPARTEMENTS_PATH}?${queryParams.toString()}`;
  return await requestService.fetchRequest(url);
};

export const getPropertiesWithAddress = async () => {
  let { data: properties } = await axios.get(`${url}byorganizationid/${organizationId}`);
  let propertiesToReturn = [];
  for (const property of properties) {
    if (property.archived === false) {
      let { data: address } = await axios.get(`/Address/${property.addressId}`);
      const { data: apartments } = await axios.get(`/Apartment/bypropertyid/${property.id}`);
      let newProperty = { ...property, address: address, apartments: apartments };
      propertiesToReturn = [...propertiesToReturn, newProperty];
    }
};
  return propertiesToReturn;
}

export const getProperty = (id) => {
  return axios.get(url, id);
};

export const deleteProperty = async (property) => {
  //const urlWithParam = `${url}${id}`;
  property.archived = true;
  return await axios.put(url, property);
};

export const putProperty = async (body) => {
  const urlWithParam = `${url}`;
  let data = body;
  let result = await axios.put("/Address/", data.address);
  delete data.address;
  return await axios.put(urlWithParam, data);
};

export const postProperty = async (body) => {
  const urlWithParam = `${url}`;
  let data = body;
  let { data: addressId } = await axios.post("/Address/", data.address);
  delete data.address;
  let propertyToSend = { ...data, addressId: addressId, organizationId: organizationId };
  return await axios.post(urlWithParam, propertyToSend);
};
