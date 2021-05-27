import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_TENANTS_REQUEST,
  FETCH_TENANTS_SUCCESS,
  FETCH_TENANTS_FAILURE,
  FETCH_DASHBOARD_TENANTS_REQUEST,
  FETCH_DASHBOARD_TENANTS_SUCCESS,
  FETCH_DASHBOARD_TENANTS_FAILURE,
  POST_TENANT_REQUEST,
  POST_TENANT_SUCCESS,
  POST_TENANT_FAILURE
} from "./types";
import TenantsService from "../../services/TenantsService/index";
import AccountsService from "../../services/AccountsService";

const fetchTenantsRequest = () => {
  return requestActionCreator(FETCH_TENANTS_REQUEST);
};

const fetchTenantsSuccess = (payload) => {
  return responseActionCreator(FETCH_TENANTS_SUCCESS, payload);
};

const fetchTenantsFailure = (payload) => {
  return responseActionCreator(FETCH_TENANTS_FAILURE, payload);
};

const fetchDashboardTenantsRequest = () => {
  return requestActionCreator(FETCH_DASHBOARD_TENANTS_REQUEST);
};

const fetchDashboardTenantsSuccess = (payload) => {
  return responseActionCreator(FETCH_DASHBOARD_TENANTS_SUCCESS, payload);
};

const fetchDashboardTenantsFailure = (payload) => {
  return responseActionCreator(FETCH_DASHBOARD_TENANTS_FAILURE, payload);
};

const postTenantRequest = () => {
  return requestActionCreator(POST_TENANT_REQUEST);
};

const postTenantSuccess = (payload) => {
  return responseActionCreator(POST_TENANT_SUCCESS, payload);
};

const postTenantFailure = (payload) => {
  return responseActionCreator(POST_TENANT_FAILURE, payload);
};

export const fetchDashBoardTenants = (appartements) => async (dispatch) => {
  dispatch(fetchDashboardTenantsRequest());
  try {
    const results = await TenantsService.fetchTenants(appartements);
    await dispatch(fetchDashboardTenantsSuccess(results.data));
  } catch (error) {
    await dispatch(fetchDashboardTenantsFailure(error));
  }
};

export const postNewTenant = (tenant) => async (dispatch) => {
  dispatch(postTenantRequest());
  try {
    const results = await TenantsService.postTenant(tenant);
    await dispatch(postTenantSuccess(results.data));
  } catch (error) {
    await dispatch(postTenantFailure(error));
  }
};

export const fetchTenants = (appartements, listings) => async (dispatch) => {
  dispatch(fetchTenantsRequest());
  try {
    if (
      appartements.length == 0 ||
      !appartements ||
      listings.length == 0 ||
      !listings
    ) {
      throw new Error("params is null");
    }
    for (const appartement of appartements) {
      const find = listings.find(
        (listing) => listing.apartmentId === appartement.id
      );
      if (find) appartement["listingName"] = find.titre;
    }
    const tenants = await TenantsService.fetchTenants(appartements).then(
      (tenants) => tenants.data
    );
    if (tenants.length > 0) {
      const personalInfos = await AccountsService.fetchTenantsAccountsInfo(
        tenants
      ).then((personalInfos) => personalInfos.data);
      for (const tenant of tenants) {
        const find = appartements.find(
          (appartement) => appartement.tenantId === tenant.accountId
        );
        if (find) tenant["appartementName"] = find["listingName"];
        const find2 = personalInfos.find(
          (personalInfo) => personalInfo.id === tenant.accountId
        );
        if (find2) tenant["tenantInfo"] = find2;
      }
    }
    await dispatch(fetchTenantsSuccess(tenants));
  } catch (error) {
    await dispatch(fetchTenantsFailure(error));
  }
};
