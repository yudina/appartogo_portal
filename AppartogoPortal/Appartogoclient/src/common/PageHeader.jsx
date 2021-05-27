import React from "react";

import { Translate } from "react-translated";

export default function PageHeader({ headerName }) {
  return (
    <div className="listings-title-container">
      <h2 className="listings-title">
        <Translate text={headerName}></Translate>
      </h2>
      {/* <input
        type="text"
        className="listings-title-search"
        placeholder="search"
      ></input> */}
    </div>
  );
}
