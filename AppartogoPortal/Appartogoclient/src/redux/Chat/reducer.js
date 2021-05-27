import { find } from "lodash";
import { requestState, failureState } from "../utils";
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

const initialeState = {
  conversations: [],
  participants: [],
  messages: [],
  unreadConversations: false,
  selectedConversation: null,
  selectedParticipant: null,
  error: null,
  isLoading: false,
};

const isThereUnreadConversations = (conversations, messages) => {
  for (const conversation of conversations) {
    const messagesByConversation = messages.filter(
      (message) => message.conversationId === conversation.id
    );
    if (messagesByConversation.find((message) => message.wasReceived !== true))
      return true;
  }
  return false;
};

const successState = (state, action) => {
  return {
    ...state,
    conversations: action.payload.conversations,
    participants: action.payload.participants,
    messages: action.payload.messages,
    selectedConversation: action.payload.conversations[0],
    selectedParticipant: action.payload.participants[0],
    unreadConversations: isThereUnreadConversations(
      action.payload.conversations,
      action.payload.messages
    ),
  };
};

const newConversationSuccessState = (state, action) => {
  const conversations = [
    ...state.conversations,
    action.payload.newConversation,
  ];
  const participants = [...state.participants, action.payload.newParticipant];
  const messages = [...state.messages, action.payload.message];
  return {
    ...state,
    conversations: conversations,
    participants: participants,
    messages: messages,
    unreadConversations: isThereUnreadConversations(conversations, messages),
  };
};

const newMessageState = (state, action) => {
  const conversations = state.conversations;
  const messages = [...state.messages, action.payload];
  return {
    ...state,
    messages: messages,
    unreadConversations: isThereUnreadConversations(conversations, messages),
  };
};

const markeAsReadSuccessState = (state, action) => {
  let messages = state.messages;
  let messagesReceived = action.payload;
  const conversations = state.conversations;
  for (let message of messages) {
    let unreadMessage = messagesReceived.find((mes) => message.id === mes.id);
    if (unreadMessage) {
      message["wasReceived"] = true;
    }
  }
  console.log("messages: ", messages);
  return {
    ...state,
    messages: messages,
    unreadConversations: isThereUnreadConversations(conversations, messages),
  };
};

const selectConversation = (state, action) => {
  let selectedConversation = state.selectedConversation;
  let selectedParticipant = state.selectedParticipant;
  selectedConversation = action.payload.conversation;
  selectedParticipant = action.payload.participant;
  return {
    ...state,
    selectedConversation: selectedConversation,
    selectedParticipant: selectedParticipant,
  };
};

const chatReducer = (state = initialeState, action) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_REQUEST:
      return requestState(state, true);
    case FETCH_CONVERSATIONS_SUCCESS:
      return successState(state, action);
    case FETCH_CONVERSATIONS_FAILURE:
      return failureState(state, action);
    case FETCH_NEW_CONVERSATION_REQUEST:
      return requestState(state, false);
    case FETCH_NEW_CONVERSATION_SUCCESS:
      return newConversationSuccessState(state, action);
    case ADD_NEW_MESSAGE:
      return newMessageState(state, action);
    case FETCH_NEW_CONVERSATION_FAILURE:
      return failureState(state, action);
    case MARK_MESSAGES_AS_READ_REQUEST:
      return requestState(state, true);
    case MARK_MESSAGES_AS_READ_SUCCESS:
      return markeAsReadSuccessState(state, action);
    case MARK_MESSAGES_AS_READ_FAILURE:
      return failureState(state, action);
    case SELECT_CONVERSATION:
      return selectConversation(state, action);
    default:
      return state;
  }
};

export default chatReducer;
