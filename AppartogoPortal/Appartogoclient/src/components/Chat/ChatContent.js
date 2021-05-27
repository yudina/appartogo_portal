import React from "react";
import { CardBody, CardHeader, Card, CardFooter } from "reactstrap";

import { ChatLeft } from "../../components/Chat/ChatLeft";
import { ChatRight } from "../../components/Chat/ChatRight";
import { ChatCardFooter } from "../../components/Chat/ChatCardFooter";
import { ChatCardHeader } from "../../components/Chat/ChatCardHeader";
import moment from "moment";
import "./Chat.css";
import { Translate } from "react-translated";

const ChatContent = ({
  sendMesageHandler,
  currentUser,
  participant,
  conversation,
  messages,
  language,
}) => {
  const sortByDate = (messages) => {
    messages.sort((a, b) =>
      moment.utc(a.sentDate).diff(moment.utc(b.sentDate))
    );
  };

  const filterCurrentUserMessage = (message) => {
    return message.senderId === currentUser.id;
  };

  const getNewMessage = (message) => {
    return {
      conversationId: conversation.id,
      senderId: currentUser.id,
      receiverId: participant.id,
      text: message,
      hasAttachment: false,
      sentDate: moment().format(),
      wasReceived: false,
      archived: false,
      isPartOfApplication: false,
    };
  };

  const sendMesage = async (message) => {
    const newMessage = getNewMessage(message);
    sendMesageHandler(newMessage, conversation.id);
  };

  if (messages.length > 0) {
    const conversationMessage = messages.filter(
      (message) => message.conversationId === conversation.id
    );
    sortByDate(conversationMessage);
    const lastMessage = conversationMessage[conversationMessage.length - 1];
    return (
      <Card className="mb-3">
        <CardHeader className="d-flex bb-0 bg-white">
          <ChatCardHeader participant={participant} />
        </CardHeader>
        <CardBody className="scrollable-div fixed">
          {conversationMessage.map((message) => {
            return filterCurrentUserMessage(message) ? (
              <ChatRight
                key={message.id}
                currentUser={currentUser}
                message={message}
                cardClassName="text-dark"
              />
            ) : (
              <ChatLeft
                key={message.id}
                participant={participant}
                message={message}
                cardClassName="bg-gray-300 b-0 text-dark"
              />
            );
          })}
        </CardBody>
        {lastMessage.senderId === currentUser.id &&
        lastMessage.wasReceived === true ? (
          <span>
            <Translate text="Seen" />
          </span>
        ) : null}
        <CardFooter>
          <ChatCardFooter sendMesage={sendMesage} language={language} />
        </CardFooter>
      </Card>
    );
  } else
    return (
      <Card className="mb-3">
        <CardHeader className="d-flex bb-0 bg-white">
          <ChatCardHeader participant={participant} />
        </CardHeader>
        <CardBody></CardBody>
        <CardFooter>
          <ChatCardFooter sendMesage={sendMesage} language={language} />
        </CardFooter>
      </Card>
    );
};

export { ChatContent };
