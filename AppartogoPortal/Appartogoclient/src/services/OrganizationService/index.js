import * as requestService from "../RequestService/index";

const { REACT_APP_DEV_OWNER_ORGANIZATION_PATH } = process.env;

const fetchOrganisation = async (accountId) => {
  return await requestService.fetchRequest(
    `${REACT_APP_DEV_OWNER_ORGANIZATION_PATH}${accountId}`
  );
};

const updateOrganisation = async (id, body) => {
  const urlWithParam = `${REACT_APP_DEV_OWNER_APPLICATIONS_PATH}${id}`;
  return await requestService.putRequest(urlWithParam, body);
};

export default { fetchOrganisation, updateOrganisation };
