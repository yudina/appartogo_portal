import axios from 'axios';
import * as requestService from "../../RequestService";

const url = '/Listing/';
const { REACT_APP_DEV_OWNER_APPARTEMENTS_PATH, REACT_APP_DEV_OWNER_LISTINGS_PATH } = process.env;

let organizationId = "";

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

export const getListingByOrgId = async () => {
  let mylistings = [];
  let { data: properties } = await axios.get(`/Property/byorganizationid/${organizationId}`);
  if (properties.length) {
    let {data:apartments} = await fetchAppartments(properties)
    let listings = await fetchListings(apartments);
    let attachments = await getListingsAttachment(listings);
    
    mylistings = listings.map(listing => {
      let apartment = apartments.find(apartment => apartment.id === listing.apartmentId);
      let attachmentsListing = getAttachmentsdByListing(listing, attachments);
      let attachment = attachmentsListing.length > 0 ? attachmentsListing[0] : {id: 'no-image', type: '.png'}
      return {...listing, apartment: apartment, attachment: attachment};
    });
  }
  return mylistings
}

const fetchListings = async (apartements) => {
  let listings = []
  if (apartements.length > 0) {
    const apartementsId = apartements.map(apartement => apartement.id);
    const queryParams = new URLSearchParams();
    for (const apartementId of apartementsId) {
      queryParams.append("ids", apartementId);
    }
    const url = `${REACT_APP_DEV_OWNER_LISTINGS_PATH}?${queryParams.toString()}`
    let { data:listingsRes } = await requestService.fetchRequest(url);
    listings = listingsRes;
  }
  return listings;
  
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

export const postListingImage = async(selectedFile, listingId) => {
  var fd = new FormData();
    fd.append('AttachmentFile', selectedFile);
    fd.append('listingId', listingId);
    fd.append('name', selectedFile.name);
    fd.append('type', selectedFile.name.slice(selectedFile.name.indexOf('.'), selectedFile.name.length));
  let { data:attachmentId } = await axios.post('/Attachment', fd);
  let data = await axios.get('/Attachment/'+attachmentId);
}

export const putListingImage = async(selectedFile, listingId, attachment) => {
  if (attachment.id != 'no-image') {
    let resDelete = await axios.delete(`Attachment/${attachment.id}`);
  }
  let res = await postListingImage(selectedFile, listingId);
}

export const getAttachmentsdByListing = (listing, attachments) => {
  return attachments.filter(attachment => attachment != undefined && attachment.listingId === listing.id);
}

export const getListingsAttachment = async(listings) => {
  let listingsId = listings.map(listing => listing.id);
  const queryParams = new URLSearchParams();
  for (const listingId of listingsId) {
    queryParams.append("ids", listingId);
  }
  let { data:attachments } = await axios.get(`/Attachment/bylistlistingids/Attachment?${queryParams.toString()}`);
  return attachments;
}

export const getListingsWithApartments = async (listings) => {
  let listingsToReturn = []
  for (const listing of listings) {
    let {data: apartment} = await axios.get(`/Apartment/${listing.apartmentId}`);
    let newListing = {...listing, apartment: apartment};
    listingsToReturn = [...listingsToReturn, newListing];
  };
  return listingsToReturn;
}; 



export const getListing = (id) => {
  return axios.get(url, id);
};

export const deleteListing = async (id) => {
  const urlWithParam = `${url}${id}`;
  return await axios.delete(urlWithParam);
};

export const putListing = async (body) => {
  
  let data = body;
  delete data.apartment;
  delete data.attachment;
  const urlWithParam = `${url}`;
  return await axios.put(urlWithParam, body);
};

export const postListing = async (body) => {
  let data = body;
  delete data.apartment;
  const urlWithParam = `${url}`;
  let {data: id} = await axios.post(urlWithParam, body);
  return id;
};