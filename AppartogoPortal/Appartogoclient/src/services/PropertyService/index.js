import * as requestService from "../RequestService/index";
import buildUrl from "build-url";


const { REACT_APP_DEV_OWNER_PROPERTY_PATH, REACT_APP_DEV_OWNER_PROPERTY_BY_ORGANIZATION_ID_PATH } = process.env;

const fetchProperties = async (organizationId) => {
  //const organizationId = organization["organizationId"];
  const url = buildUrl(REACT_APP_DEV_OWNER_PROPERTY_PATH, {
    queryParams: {
      id: organizationId
    }
  });
  return await requestService.fetchRequest(url);
};

const fetchPropertiesByOrg = async (organizationId) => {
  const urlWithParam =  `${REACT_APP_DEV_OWNER_PROPERTY_BY_ORGANIZATION_ID_PATH}${organizationId}`;
  return await requestService.fetchRequest(urlWithParam)
}

const fetchAllPropertiesByOrg = async (organizationId) => {
  const urlWithParam =  `Property/byorganizationId/${organizationId}`;
  return await requestService.fetchRequest(urlWithParam)
}

const deleteProperty = async (property) => {
  const urlWithParam = `${REACT_APP_DEV_OWNER_PROPERTY_PATH}`;
  property.archived = true;
  return await requestService.putRequest(urlWithParam, property);
};

const modifyProperty = async (id, body) => {
  const urlWithParam = `${REACT_APP_DEV_OWNER_PROPERTY_PATH}${id}`;
  return await requestService.putRequest(urlWithParam, body);
};

const putProperty = async (property) => {
  return await requestService.putRequest(REACT_APP_DEV_OWNER_PROPERTY_PATH, property);
}

const createProperty = async (property) => {
  return await requestService.postRequest(REACT_APP_DEV_OWNER_PROPERTY_PATH, property);
}


export default { fetchProperties, 
  deleteProperty, 
  createProperty,
   modifyProperty, 
   putProperty, 
   fetchPropertiesByOrg,
   fetchAllPropertiesByOrg
   };
