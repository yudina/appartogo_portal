import React from "react";
import PropTypes from "prop-types";
import { map, isInteger } from "lodash";
import { Pagination, PaginationItem, PaginationLink, Col } from "reactstrap";

import {
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleRight,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const mapToFa = {
  "<": (
    <i>
      <FontAwesomeIcon icon={faAngleLeft} className="fa-fw" />
    </i>
  ),
  "<<": (
    <i>
      <FontAwesomeIcon icon={faAngleDoubleLeft} className="fa-fw text-muted" />
    </i>
  ),
  ">": (
    <i>
      <FontAwesomeIcon icon={faAngleRight} className="fa-fw" />
    </i>
  ),
  ">>": (
    <i>
      <FontAwesomeIcon icon={faAngleDoubleRight} className="fa-fw text-muted" />
    </i>
  ),
};

export const CustomPaginationPanel = ({ onPageChange, pages, ...otherProps }) => (
  <Col md={6} className="d-flex">
    <Pagination {...otherProps} listClassName="my-0">
      {map(pages, (page) => (
        <PaginationItem active={page.active} disabled={page.disabled}>
          <PaginationLink onClick={() => onPageChange(page.page)}>
            {isInteger(page.page) ? page.page : mapToFa[page.page]}
          </PaginationLink>
        </PaginationItem>
      ))}
    </Pagination>
  </Col>
);
CustomPaginationPanel.propTypes = {
  pages: PropTypes.array,
  onPageChange: PropTypes.func,
};
