import * as requestService from "../RequestService/index";


const { REACT_APP_DEV_OWNER_LISTINGS_PATH, REACT_APP_DEV_OWNER_LISTING_PATH } = process.env;

const fetchListings = async (appartements) => {
  const appartementsId = appartements.map(appartement => appartement.id);
  const queryParams = new URLSearchParams();
  for (const appartementId of appartementsId) {
    queryParams.append("ids", appartementId);
  }
  const url = `${REACT_APP_DEV_OWNER_LISTINGS_PATH}?${queryParams.toString()}`
  return await requestService.fetchRequest(url);
};

const deleteListing = async (id) => {
  const urlWithParam = `${url}${id}`;
  return await requestService.deleteRequest(urlWithParam);
};

const modifyListing = async (body) => {
  const url = REACT_APP_DEV_OWNER_LISTING_PATH;
  return await requestService.putRequest(url, body);
};

const createlisting =  async (body) => {
  const url = REACT_APP_DEV_OWNER_LISTING_PATH;
  return await requestService.postRequest(url, body);
}

export default { fetchListings, deleteListing, modifyListing, createlisting};
