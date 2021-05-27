import axios from "axios";

const url = "/Apartment/";
let accountId = "";

export const setAccountId = (id) => {
  accountId = id;
};

export const getApartmentsByProperty = async (propertyId) => {
  const { data: apartments } = await axios.get(`${url}bypropertyid/${propertyId}`);
  let apartmentsToReturn = apartments.filter(apartment => apartment.archived === false); 
  return apartmentsToReturn;
};

export const getApartments = () => {
  return axios.get(url);
};

export const getApartment = (id) => {
  return axios.get(url, id);
};

export const deleteApartment = async (apartment) => {
  let listings = await getApartmentListings(apartment.id);
  for (const listing of listings) {
    if (listing.archived === false) {
      listing.archived = true;
    }
    let res = await axios.put('/Listing', listing);
  }
  apartment.archived = true;
  return await axios.put(url, apartment);
};

export const getApartmentListings = async (apartmentId) => {
  const { data:listings } = await axios.get(`/Listing/byapartmentid/${apartmentId}`);
  return listings;
}

export const putApartment = async (body) => {
  const urlWithParam = `${url}`;
  return await axios.put(urlWithParam, body);
};

export const postApartment = async (body) => {
  let data = body;
  let apartToSend = { ...data };
  const urlWithParam = `${url}`;
  return await axios.post(urlWithParam, apartToSend);
};
