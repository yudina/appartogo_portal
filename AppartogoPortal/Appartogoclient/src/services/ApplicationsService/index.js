import * as requestService from "../RequestService/index";

const { REACT_APP_DEV_OWNER_APPLICATIONS_PATH } = process.env;

const fetchApplications = async (listings) => {
  const listingsId = listings.map((listing) => listing.id);
  const queryParams = new URLSearchParams();
  for (const listingId of listingsId) {
    queryParams.append("ids", listingId);
  }
  const url = `${REACT_APP_DEV_OWNER_APPLICATIONS_PATH}?${queryParams.toString()}`;
  return await requestService.fetchRequest(url);
};

const modifyApplications = async (modifiedApplication) => {
  const url = `/Application`;
  return await requestService.putRequest(url, modifiedApplication);
};

export default { fetchApplications, modifyApplications };
