import React, { useState, useEffect } from "react";

import { Card, Media } from "reactstrap";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

const Message = ({ message, currentUser }) => (
  <Media className="mb-2">
    <Media body>
      <Card body className={`mb-2 bg-light`}>
        <p className="mb-0">{message.text}</p>
      </Card>
      <div className="mb-2 text-right">
        <span className="text-inverse mr-2">
          <b>
            {currentUser.firstName} {currentUser.lastName}
          </b>
        </span>
        <span className="small">
          <i>{moment(message.sentDate).format('lll')}</i>
        </span>
      </div>
    </Media>
    <Media right className="ml-3">
      <FontAwesomeIcon icon={faUser} className="mr-3 fa-fw" />
    </Media>
  </Media>
);

const ChatRight = (props) => {
  let [data, setData] = useState(props);
  useEffect(() => {
    setData(props);
  }, [props]);
  return data ? (
    <React.Fragment>
      <Message message={data.message} currentUser={data.currentUser} />
    </React.Fragment>
  ) : null;
};

export { ChatRight };
