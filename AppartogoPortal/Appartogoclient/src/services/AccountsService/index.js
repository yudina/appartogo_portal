import * as requestService from "../RequestService/index";

const fetchApplicantsAccountsInfo = async (applications) => {
  const queryParams = new URLSearchParams();
  for (const application of applications) {
    queryParams.append("ids", application.accountId);
  }
  return await requestService.fetchRequest(
    `Account/bylist/Account?${queryParams.toString()}`
  );
};

const fetchTenantsAccountsInfo = async (tenants) => {
  const queryParams = new URLSearchParams();
  for (const tenant of tenants) {
    queryParams.append("ids", tenant.accountId);
  }
  return await requestService.fetchRequest(
    `Account/bylist/Account?${queryParams.toString()}`
  );
};

const fetchParticipantsInfo = async (participants) => {
  const queryParams = new URLSearchParams();
  for (const participant of participants) {
    queryParams.append("ids", participant.id);
  }
  return await requestService.fetchRequest(
    `Account/bylist/Account?${queryParams.toString()}`
  );
};

const getProfileInfo = async (accountId) => {
  return await requestService.fetchRequest(`Account//${accountId}`);
};

const updateProfileInfo = async (profileInfo) => {
  return await requestService.putRequest(
    `Account/byaccountid/?${accountId}`,
    profileInfo
  );
};
export default {
  fetchApplicantsAccountsInfo,
  fetchTenantsAccountsInfo,
  getProfileInfo,
  updateProfileInfo,
  fetchParticipantsInfo,
};
