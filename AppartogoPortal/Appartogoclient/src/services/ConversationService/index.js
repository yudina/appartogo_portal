import * as requestService from "../RequestService/index";

const fetchConversationsFromApplications = async (applications) => {
  const queryParams = new URLSearchParams();
  for (const application of applications) {
    queryParams.append("ids", application.listingId);
  }
  return await requestService.fetchRequest(
    `Conversation/bylistlistingids/Conversation?${queryParams.toString()}`
  );
};

const fetchConversationsByListing = async (listings) => {
  const queryParams = new URLSearchParams();
  for (const listing of listings) {
    queryParams.append("ids", listing.id);
  }
  return await requestService.fetchRequest(
    `Conversation/bylistlistingids/Conversation?${queryParams.toString()}`
  );
};

const fetchFirstMessageFromConversation = async (conversations) => {
  let requests = [];
  for (const conversation of conversations) {
    requests.push(
      requestService.fetchRequest(
        `Message/firstmessage/byconversationid/${conversation.id}`
      )
    );
  }
  return await Promise.all(requests);
};

const fetchMessagesByConversation = async (conversation) => {
  const url = `/Message/byconversationid/${conversation.id}`;
  return await requestService.fetchRequest(url);
};

const fetchConversationBycreatedbyid = async (accountId) => {
  const url = `/conversation/bycreatedbyid/${accountId}`;
  return await requestService.fetchRequest(url);
};

const fetchConversationByOtherParticipant = async (accountId) => {
  const url = `/conversation/byotherparticipantid/${accountId}`;
  return await requestService.fetchRequest(url);
};

const fetchConversationById = async (conversationId) => {
  const url = `Conversation/${conversationId}`;
  return await requestService.fetchRequest(url);
};

const postConversation = async (conversation) => {
  const url = "/Conversation";
  return await requestService.postRequest(url, conversation);
};

const updateMessage = async (message) => {
  const url = `/Message/`;
  return await requestService.putRequest(url, message);
};
export default {
  fetchConversationsFromApplications,
  fetchFirstMessageFromConversation,
  fetchConversationsByListing,
  fetchMessagesByConversation,
  fetchConversationBycreatedbyid,
  fetchConversationByOtherParticipant,
  fetchConversationById,
  postConversation,
  updateMessage
};
