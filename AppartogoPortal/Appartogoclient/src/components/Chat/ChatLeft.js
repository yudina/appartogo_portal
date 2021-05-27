import React, { useState, useEffect } from "react";

import { Card, Media } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const Message = ({ participant, message }) => (
  <Media className="mb-2">
    <Media left className="mr-3">
      <FontAwesomeIcon icon={faUser} className="mr-3 fa-fw" />
    </Media>
    <Media body>
      <Card body className={`mb-2 bg-white`}>
        <p className="mb-0">{message.text}</p>
      </Card>
      <div className="mb-2">
        <span className="text-inverse mr-2">
          <b>
            {participant.firstName} {participant.lastName}
          </b>
        </span>
        <span className="small">
          <i>{moment(message.sentDate).format("lll")}</i>
        </span>
      </div>
    </Media>
  </Media>
);

const ChatLeft = (props) => {
  const [data, setData] = useState(props);
  useEffect(() => {
    setData(props);
  }, [props]);
  return data ? (
    <React.Fragment>
      <Message participant={data.participant} message={data.message} />
    </React.Fragment>
  ) : null;
};

export { ChatLeft };
