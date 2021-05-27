import {
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATIONS_FAILURE,
  FETCH_APPLICATIONS_SUCCESS,
  UPDATE_APPLICATIONS_REQUEST,
  UPDATE_APPLICATIONS_SUCCESS,
  UPDATE_APPLICATIONS_FAILURE,
  FETCH_DASHBOARD_APPLICATIONS_REQUEST,
  FETCH_DASHBOARD_APPLICATIONS_SUCCESS,
  FETCH_DASHBOARD_APPLICATIONS_FAILURE,
} from "./types";
import ApplicationsService from "../../services/ApplicationsService/index";
import { requestActionCreator, responseActionCreator } from "../utils";
import TenantsService from "../../services/TenantsService";
import AccountsService from "../../services/AccountsService";
import ConversationService from "../../services/ConversationService";

const fetchDashboardApplicationsRequest = () => {
  return requestActionCreator(FETCH_DASHBOARD_APPLICATIONS_REQUEST);
};

const fetchDashboardApplicationsSuccess = (payload) => {
  return responseActionCreator(FETCH_DASHBOARD_APPLICATIONS_SUCCESS, payload);
};
const fetchDashboardApplicationsFailure = (payload) => {
  return responseActionCreator(FETCH_DASHBOARD_APPLICATIONS_FAILURE, payload);
};

const fetchApplicationsRequest = () => {
  return requestActionCreator(FETCH_APPLICATIONS_REQUEST);
};

const fetchApplicationsSuccess = (payload) => {
  return responseActionCreator(FETCH_APPLICATIONS_SUCCESS, payload);
};
const fetchApplicationsFailure = (payload) => {
  return responseActionCreator(FETCH_APPLICATIONS_FAILURE, payload);
};

const updateApplicationsRequest = () => {
  return requestActionCreator(UPDATE_APPLICATIONS_REQUEST);
};

const updateApplicationsSuccess = (payload) => {
  return responseActionCreator(UPDATE_APPLICATIONS_SUCCESS, payload);
};
const updateApplicationsFailure = (payload) => {
  return responseActionCreator(UPDATE_APPLICATIONS_FAILURE, payload);
};

export const fetchDashBoardContent = (listings) => async (dispatch) => {
  dispatch(fetchDashboardApplicationsRequest());
  try {
    const result = await ApplicationsService.fetchApplications(listings);
    await dispatch(fetchDashboardApplicationsSuccess(result.data));
  } catch (error) {
    await dispatch(fetchDashboardApplicationsFailure(error));
  }
};

export const fetchApplicationsContent = (listings) => async (dispatch) => {
  dispatch(fetchApplicationsRequest());
  try {
    let applications = await ApplicationsService.fetchApplications(listings);
    applications = applications.data;
    if (applications.length > 0) {
      let paralelRequestResult = await Promise.all([
        TenantsService.fetchApplicantsConsent(applications),
        AccountsService.fetchApplicantsAccountsInfo(applications),
        ConversationService.fetchConversationsFromApplications(applications),
      ]);
      let applicantsConstents = paralelRequestResult[0].data;
      let profileInformations = paralelRequestResult[1].data;
      let conversations = paralelRequestResult[2].data;
      let messages = await ConversationService.fetchFirstMessageFromConversation(
        conversations
      ).then((messages) => messages.map((message) => message.data));
      for (const conversation of conversations) {
        const find = messages.find(
          (message) => message.conversationId === conversation.id
        );
        if (find) conversation["message"] = find["text"];
      }

      for (const application of applications) {
        let listingInfo = listings.find(
          (listing) => listing.id === application.listingId
        );
        let profileInformation = profileInformations.find(
          (profileInformation) =>
            profileInformation.id === application.accountId
        );
        let creditInformation = applicantsConstents.find(
          (appliquant) => appliquant.accountId == application.accountId
        );
        let conversation = conversations.find(
          (conversation) => conversation.createdById == application.accountId
        );
        if (listingInfo) application["listing"] = listingInfo;
        if (profileInformation) application["applicant"] = profileInformation;
        if (creditInformation) application["constent"] = creditInformation;
        if (conversation) application["message"] = conversation["message"];
      }
    }
    await dispatch(fetchApplicationsSuccess(applications));
  } catch (error) {
    await dispatch(fetchApplicationsFailure(error));
  }
};

export const updateApplications = (application, change) => async (dispatch) => {
  dispatch(updateApplicationsRequest());
  try {
    await ApplicationsService.modifyApplications(
      updateRequest(application, change)
    );
    await dispatch(
      updateApplicationsSuccess(Object.assign(application, change))
    );
  } catch (error) {
    await dispatch(updateApplicationsFailure(error));
  }
};

const updateRequest = (application, change) => {
  return {
    id: application["id"],
    accountId: application["accountId"],
    listingId: application["listingId"],
    status: change["status"],
    applicationDate: application["applicationDate"],
  };
};
