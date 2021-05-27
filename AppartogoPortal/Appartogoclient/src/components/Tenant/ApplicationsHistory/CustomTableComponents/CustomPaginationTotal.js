import React from "react";
import PropTypes from "prop-types";
import { Translate } from "react-translated";

export const CustomPaginationTotal = ({ from, to, size }) => (
  <span className="small ml-2">
    <Translate
      text="Showing {from} to {to} of {size} Results"
      data={{ from: from, to: to, size: size }}
    />
  </span>
);
CustomPaginationTotal.propTypes = {
  from: PropTypes.number,
  to: PropTypes.number,
  size: PropTypes.number,
};
