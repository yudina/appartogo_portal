import * as requestService from "../RequestService/index";
import buildUrl from "build-url";

const { REACT_APP_DEV_OWNER_ATTACHMENT_PATH } = process.env;

export const fetchAttachmentsById = async(content) => {
  return await requestService.fetchRequest(`/Attachment/byapplicationid/${content.id}`);
}

export const fetchAttachments = async(listings) => {
  let listingsId = listings.map(listing => listing.id);
  const queryParams = new URLSearchParams();
  for (const listingId of listingsId) {
    queryParams.append("ids", listingId);
  }
  return await requestService.fetchRequest(`/Attachment/bylistlistingids/Attachment?${queryParams.toString()}`);
}

const deleteAttachment = async (attachment) => {
  const urlWithParam = `${REACT_APP_DEV_OWNER_ATTACHMENT_PATH}${attachment.id}`;
  return await requestService.deleteRequest(urlWithParam);
};

const createAttachment = async (attachment) => {
  const urlWithParam = `${REACT_APP_DEV_OWNER_ATTACHMENT_PATH}`;
  return await requestService.postRequest(urlWithParam, attachment);
};

export default { fetchAttachments, fetchAttachmentsById, deleteAttachment, createAttachment };
