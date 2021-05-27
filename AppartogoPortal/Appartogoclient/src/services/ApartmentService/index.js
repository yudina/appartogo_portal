import * as requestService from "../RequestService";

const url = `http://localhost:5000/Apartment/`;

const fetchApartments = async () => {
  return await requestService.fetchRequest(url);
};

const deleteApartment = async (id) => {
  const urlWithParam = `${url}${id}`;
  return await requestService.deleteRequest(urlWithParam);
};

const modifyApartment = async (body) => {
  const urlWithParam = `${url}${id}`;
  return await requestService.putRequest(urlWithParam, body);
};

const createApartment = async (body) => {
  const urlWithParam = `${url}`;
  return await requestService.postRequest(urlWithParam, body);
};


export default { fetchApartments, deleteApartment, modifyApartment, createApartment };
