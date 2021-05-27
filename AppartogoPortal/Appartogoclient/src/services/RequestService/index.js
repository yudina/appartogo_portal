import axios from "axios";

export const fetchRequest = async (url) => {
  return await axios.get(url);
};

export const putRequest = async (url, body) => {
  return await axios.put(url, body);
};

export const postRequest = async (url, body) => {
  return await axios.post(url, body);
};

export const deleteRequest = async (url) => {
  return await axios.delete(url);
};
