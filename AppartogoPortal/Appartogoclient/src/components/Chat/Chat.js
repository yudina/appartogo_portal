import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { ChatLeftNav } from "../../components/Chat/ChatLeftNav";
import "./Chat.css";
import { ChatContent } from "../../components/Chat/ChatContent";
import { Translate } from "react-translated";
import {
  fetchConversations,
  markMessagesAsRead,
  selectConversation,
} from "../../redux";
import { connect } from "react-redux";
import AccountsService from "../../services/AccountsService";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: this.props.auth.getAccountId(),
      currentUserInfo: null,
    };
  }

  async componentDidMount() {
    AccountsService.getProfileInfo(this.state.accountId)
      .then(async (currentUserInfo) => {
        this.setState({
          currentUserInfo: currentUserInfo.data,
        });
        await this.props.fetchConversations(this.state.accountId);
      })
      .catch((err) => console.log(err));
  }

  selectConversation = async (participant) => {
    const participantId = participant.id;
    const conversation = this.props.conversations.find(
      (conversation) => conversation.createdById === participant.id
    );
    const conversationId = conversation.id;
    if (conversation) {
      await this.props.markMessagesAsRead(conversationId, participantId);
      await this.props.selectConversation(participantId);
    }
  };

  calculateNumberOfUnreadMessage = () => {
    let numberOfUnreadMessageByconv = {};
    for (const conversation of this.props.conversations) {
      const messages = this.props.messages.filter((message) => {
        return (
          message.wasReceived === false &&
          message.conversationId === conversation.id &&
          message.receiverId === conversation.otherParticipantId
        );
      });
      numberOfUnreadMessageByconv[conversation.createdById] = messages.length;
    }
    return numberOfUnreadMessageByconv;
  };

  render() {
    const {
      conversations,
      participants,
      messages,
      selectedConversation,
      selectedParticipant,
    } = this.props;
    const { currentUserInfo } = this.state;
    if (conversations && conversations.length > 0) {
      if (this.props.location.state) {
        this.props.selectConversation(this.props.location.state.participantId);
      } else {
        this.props.markMessagesAsRead(
          selectedConversation.id,
          selectedParticipant.id
        );
      }
      if (currentUserInfo) {
        console.log(this.calculateNumberOfUnreadMessage());
        return (
          <div>
            <div className="col-12 border-bottom mb-5">
              <h3>
                <Translate text="Messaging" />
              </h3>
            </div>
            <div className="ml-2 pr-5">
              <Row>
                <Col lg={3}>
                  <ChatLeftNav
                    conversations={conversations}
                    numberUnreadMessages={this.calculateNumberOfUnreadMessage()}
                    participants={participants}
                    selectedConversation={selectedConversation}
                    selectConversation={this.selectConversation}
                  />
                </Col>
                <Col lg={9}>
                  <ChatContent
                    sendMesageHandler={this.props.sendMessageHandler}
                    currentUser={currentUserInfo}
                    participant={selectedParticipant}
                    conversation={selectedConversation}
                    messages={messages}
                    language={this.props.language}
                  />
                </Col>
              </Row>
            </div>
          </div>
        );
      } else return <div>No conversations to display</div>;
    } else {
      return <div>No conversations to display</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    conversations: state.chat.conversations,
    participants: state.chat.participants,
    messages: state.chat.messages,
    selectedConversation: state.chat.selectedConversation,
    selectedParticipant: state.chat.selectedParticipant,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchConversations: (accountId) => dispatch(fetchConversations(accountId)),
    markMessagesAsRead: (conversationId, accountId) =>
      dispatch(markMessagesAsRead(conversationId, accountId)),
    selectConversation: (participantId) =>
      dispatch(selectConversation(participantId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
