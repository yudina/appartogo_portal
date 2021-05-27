import * as requestService from "../RequestService/index";
import buildUrl from "build-url";

const { REACT_APP_DEV_OWNER_APPARTEMENTS_PATH, REACT_APP_DEV_OWNER_APARTMENT_PATH } = process.env;

const fetchAppartments = async (properties) => {
  const propertiesId = properties.map((property) => property.id);
  const queryParams = new URLSearchParams();
  for (const propertyId of propertiesId) {
    queryParams.append("ids", propertyId);
  }
  const url = `${REACT_APP_DEV_OWNER_APPARTEMENTS_PATH}?${queryParams.toString()}`;
  return await requestService.fetchRequest(url);
};

const fetchAllAppartments = async (properties) => {
  const propertiesId = properties.map((property) => property.id);
  const queryParams = new URLSearchParams();
  for (const propertyId of propertiesId) {
    queryParams.append("ids", propertyId);
  }
  const url = `Apartment/bylistpropertyids/Apartment?${queryParams.toString()}`;
  return await requestService.fetchRequest(url);
};

const fetchApartmentsByProperty = async (propertyId) => {
  const urlWithParam = `/Apartment/bypropertyid/${propertyId}`;
  return await requestService.fetchRequest(urlWithParam);
};

const deleteAppartment = async (id) => {
  const urlWithParam = `${url}${id}`;
  return await requestService.deleteRequest(urlWithParam);
};

const modifyAppartment = async (appartment) => {
  return await requestService.putRequest(REACT_APP_DEV_OWNER_APARTMENT_PATH, appartment);
};

const createAppartment = async (appartment) => {
  return await requestService.postRequest(REACT_APP_DEV_OWNER_APARTMENT_PATH, appartment);
};

export default { fetchAppartments, 
  fetchApartmentsByProperty, 
  createAppartment, 
  deleteAppartment, 
  modifyAppartment, 
  fetchAllAppartments,
};
