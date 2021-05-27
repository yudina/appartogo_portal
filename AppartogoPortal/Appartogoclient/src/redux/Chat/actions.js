import { requestActionCreator, responseActionCreator } from "../utils";
import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  FETCH_CONVERSATIONS_FAILURE,
  FETCH_NEW_CONVERSATION_REQUEST,
  FETCH_NEW_CONVERSATION_SUCCESS,
  FETCH_NEW_CONVERSATION_FAILURE,
  ADD_NEW_MESSAGE,
  MARK_MESSAGES_AS_READ_REQUEST,
  MARK_MESSAGES_AS_READ_SUCCESS,
  MARK_MESSAGES_AS_READ_FAILURE,
  SELECT_CONVERSATION,
} from "./types";
import AccountsService from "../../services/AccountsService";
import ConversationService from "../../services/ConversationService";

const fetchConversationsRequest = () => {
  return requestActionCreator(FETCH_CONVERSATIONS_REQUEST);
};

const fetchConversationsSuccess = (payload) => {
  return responseActionCreator(FETCH_CONVERSATIONS_SUCCESS, payload);
};

const fetchConversationsFailure = (payload) => {
  return responseActionCreator(FETCH_CONVERSATIONS_FAILURE, payload);
};

const fetchNewConversationRequest = () => {
  return requestActionCreator(FETCH_NEW_CONVERSATION_REQUEST);
};

const fetchNewConversationSuccess = (payload) => {
  return responseActionCreator(FETCH_NEW_CONVERSATION_SUCCESS, payload);
};

const fetchNewConversationFailure = (payload) => {
  return responseActionCreator(FETCH_NEW_CONVERSATION_FAILURE, payload);
};

const markMessagesAsReadRequest = () => {
  return requestActionCreator(MARK_MESSAGES_AS_READ_REQUEST);
};

const markMessagesAsReadSuccess = (payload) => {
  return responseActionCreator(MARK_MESSAGES_AS_READ_SUCCESS, payload);
};

const markMessagesAsReadFailure = (payload) => {
  return responseActionCreator(MARK_MESSAGES_AS_READ_FAILURE, payload);
};

const addNewMessage = (payload) => {
  return responseActionCreator(ADD_NEW_MESSAGE, payload);
};

const selectConversationCreator = (payload) => {
  return responseActionCreator(SELECT_CONVERSATION, payload);
};

export const selectConversation = (participantId) => async (
  dispatch,
  getState
) => {
  let conversations = getState().chat.conversations;
  let participants = getState().chat.participants;
  const conversation = conversations.find(
    (conversation) => conversation.createdById === participantId
  );
  const participant = participants.find(
    (participant) => participant.id === participantId
  );
  dispatch(
    selectConversationCreator({
      conversation,
      participant,
    })
  );
};

export const markMessagesAsRead = (conversationId, participantId) => async (
  dispatch,
  getState
) => {
  let messages = getState().chat.messages;
  let messagesWasNotReceived = messages.filter(
    (message) =>
      message.wasReceived === false &&
      message.conversationId === conversationId &&
      participantId === message.senderId
  );
  if (messagesWasNotReceived.length > 0) {
    dispatch(markMessagesAsReadRequest());
    try {
      const result = await modifyMessages(messagesWasNotReceived);
      if (result[0].status === 200)
        dispatch(markMessagesAsReadSuccess(messagesWasNotReceived));
    } catch (error) {
      dispatch(markMessagesAsReadFailure(error));
    }
  }
};

export const fetchConversations = (accountId) => async (dispatch) => {
  dispatch(fetchConversationsRequest());
  try {
    const conversationsresult = await Promise.all([
      ConversationService.fetchConversationBycreatedbyid(accountId),
      ConversationService.fetchConversationByOtherParticipant(accountId),
    ]);
    const conversations = [
      ...conversationsresult[0].data,
      ...conversationsresult[1].data,
    ];
    if (conversations.length > 0) {
      const messages = await fetchMessageByConversations(conversations);
      const participants = await AccountsService.fetchParticipantsInfo(
        getParticipantsIds(conversations, accountId)
      );
      dispatch(
        fetchConversationsSuccess({
          conversations: conversations,
          messages: messages.flat(),
          participants: participants.data,
        })
      );
    } else
      dispatch(
        fetchConversationsSuccess({
          conversations: [],
          messages: [],
          participants: [],
        })
      );
  } catch (error) {
    dispatch(fetchConversationsFailure(error));
  }
};

export const onReceiveMessage = (message) => async (dispatch, getState) => {
  let conversations = getState().chat.conversations;
  let findConversation = conversations.find(
    (conversation) => conversation.id === message.conversationId
  );

  if (findConversation) {
    dispatch(addNewMessage(message));
  } else {
    dispatch(fetchNewConversationRequest());
    try {
      const conversationInfo = await fetchNewConversation(message);
      const newConversation = conversationInfo.conversation;
      const newParticipant = conversationInfo.newParticipant;
      dispatch(
        fetchNewConversationSuccess({
          newParticipant,
          newConversation,
          message,
        })
      );
    } catch (error) {
      dispatch(fetchNewConversationFailure(error));
    }
  }
};

const modifyMessages = (messages) => {
  const promises = [];
  for (const message of messages) {
    promises.push(
      ConversationService.updateMessage({ ...message, wasReceived: true })
    );
  }
  return Promise.all(promises);
};

const fetchNewConversation = (message) => {
  return ConversationService.fetchConversationById(message.conversationId).then(
    (conversation) => {
      return AccountsService.getProfileInfo(conversation.data.createdById).then(
        (newParticipant) => {
          return {
            conversation: conversation.data,
            newParticipant: newParticipant.data,
          };
        }
      );
    }
  );
};

const fetchMessageByConversations = (conversations) => {
  return Promise.all(
    conversations.map((conversation) =>
      ConversationService.fetchMessagesByConversation(conversation)
    )
  ).then((results) => results.map((result) => result.data));
};

const getParticipantsIds = (conversations, accountId) => {
  return conversations.map((conversation) => {
    return {
      id:
        conversation.createdById === accountId
          ? conversation.otherParticipantId
          : conversation.createdById,
    };
  });
};
