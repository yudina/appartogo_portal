import React from "react";
import PropTypes from "prop-types";
import { map } from "lodash";
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Translate } from "react-translated";

export const CustomSizePerPageButton = ({
  options,
  currSizePerPage,
  onSizePerPageChange,
  ...ddProps
}) => (
  <UncontrolledButtonDropdown {...ddProps}>
    <DropdownToggle size="sm" color="link" className="text-decoration-none">
      {currSizePerPage}
      <i>
        <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
      </i>
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem header>
        <Translate text="Page Size"></Translate>
      </DropdownItem>
      {map(options, (option) => (
        <DropdownItem
          onClick={() => onSizePerPageChange(option.page)}
          active={option.page === currSizePerPage}
        >
          {option.text}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledButtonDropdown>
);
CustomSizePerPageButton.propTypes = {
  options: PropTypes.object,
  currSizePerPage: PropTypes.number,
  onSizePerPageChange: PropTypes.func,
};
