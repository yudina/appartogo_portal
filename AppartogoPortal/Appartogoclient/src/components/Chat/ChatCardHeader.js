import {
  faAngleDown,
  faCog,
  faEllipsisV,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const ChatCardHeader = (props) => {
  let [data, setData] = useState(props);

  useEffect(() => {
    setData(props);
  }, [props]);

  return data ? (
    <React.Fragment>
      <h6 className="align-self-center mb-0">
        {data.participant.firstName} {data.participant.lastName}
      </h6>
      <UncontrolledButtonDropdown className="align-self-center ml-auto">
        <DropdownToggle color="link" size="sm" className="text-decoration-none">
          <i>
            <FontAwesomeIcon icon={faEllipsisV} className="mr-1" />
          </i>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            <i>
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
            </i>
            {data.participant.phoneNumber}
          </DropdownItem>
          <DropdownItem>
            <i>
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            </i>
            {data.participant.email}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </React.Fragment>
  ) : null;
};

export { ChatCardHeader };
