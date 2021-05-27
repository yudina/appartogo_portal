import * as requestService from "../RequestService/index";
import axios from 'axios';

const url = `http://localhost:5000/Property/`;

const fetchAppartments = async () => {
  return await requestService.fetchRequest(url);
};
const deleteAppartments = async (id) => {
  const urlWithParam = `${url}${id}`;
  return await requestService.deleteRequest(urlWithParam);
};

const modifyAppartments = async (id, body) => {
  const urlWithParam = `${url}${id}`;
  return await requestService.putRequest(urlWithParam, body);
};

//////////////////////////

export const getProperties = () => {
  return axios.get(url);
};

export const deleteProperty = async (id) => {
  const urlWithParam = `${url}${id}`;
  return await axios.delete(urlWithParam);
};

export const patchProperty = async (id, body) => {
  const urlWithParam = `${url}${id}`;
  return await axios.patch(urlWithParam, body);
};

export const postProperty = async (body) => {
  const urlWithParam = `${url}`;
  return await axios.post(urlWithParam, body);
};


export default { fetchAppartments, deleteAppartments, modifyAppartments };
