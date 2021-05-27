import * as requestService from "../RequestService/index";

const fetchTenants = async (appartements) => {
  const queryParams = new URLSearchParams();
  for (const appartement of appartements) {
    queryParams.append("ids", appartement.tenantId);
  }
  const url = `/Tenant/bylist/Tenant?${queryParams.toString()}`;
  return await requestService.fetchRequest(url);
};

const fetchApplicantsConsent = async (applications) => {
  const queryParams = new URLSearchParams();
  for (const application of applications) {
    queryParams.append("ids", application.accountId);
  }
  const url = `/Tenant/bylistaccountids/Tenant?${queryParams.toString()}`;
  return await requestService.fetchRequest(url);
};

const postTenant = async (tenant) => {
  const url = `/Tenant`;
  return await requestService.postRequest(url, tenant);
};

const modifyTenant = async (tenant) => {
  const url = `/Tenant`;
  return await requestService.putRequest(url, tenant);
};

export default {
  fetchTenants,
  fetchApplicantsConsent,
  postTenant,
  modifyTenant,
};
