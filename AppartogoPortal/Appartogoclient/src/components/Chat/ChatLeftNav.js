import React, { Component } from "react";

import { Media, Collapse, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { Nav } from "react-bootstrap";

export class ChatLeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };
  }

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const {
      selectedConversation,
      participants,
      selectConversation,
      numberUnreadMessages,
    } = this.props;
    const Participant = ({
      participant,
      selectConversation,
      numberUnreadMessage,
      selectedConversation,
    }) => {
      const unreadConvoStyle = {
        backgroundColor: "red",
      };
      return (
        <Nav.Item>
          <Nav.Link
            style={numberUnreadMessage > 0 ? unreadConvoStyle : null}
            className="hover-color"
            className={
              participant.id === selectedConversation.createdById ||
              participant.id === selectedConversation.otherParticipantId
                ? "nav-link active"
                : null
            }
            eventKey={participant.id}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              selectConversation(participant);
            }}
          >
            <Media>
              <Media left className="align-self-start mr-3">
                <FontAwesomeIcon icon={faUser} className="mr-3 fa-fw" />
              </Media>
              <Media body>
                <div
                  className="mt-0 d-flex"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    <b>
                      {participant.firstName} {participant.lastName}
                    </b>
                  </p>
                  {numberUnreadMessage > 0 ? (
                    <span className="label label-info">
                      {numberUnreadMessage}
                    </span>
                  ) : null}
                </div>
              </Media>
            </Media>
          </Nav.Link>
        </Nav.Item>
      );
    };
    return (
      <React.Fragment>
        <Button color="light w-100 border mb-2" onClick={this.toggle}>
          Conversations <FontAwesomeIcon icon={faAngleDown} />
        </Button>
        <Collapse isOpen={this.state.isOpen}>
          <div className="mb-4 border bg-white">
            <Nav
              variant="pills"
              className="flex-column scrollable-div-left-nav"
            >
              {participants.map((participant) => {
                return (
                  <Participant
                    numberUnreadMessage={numberUnreadMessages[participant.id]}
                    key={participant.id}
                    participant={participant}
                    selectConversation={selectConversation}
                    selectedConversation={selectedConversation}
                  />
                );
              })}
            </Nav>
          </div>
        </Collapse>
      </React.Fragment>
    );
  }
}
