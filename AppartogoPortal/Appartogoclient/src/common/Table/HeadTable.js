import React from "react";

import { Translate } from "react-translated";

export default function HeadTable(props) {
  return (
    <thead>
      <tr>
        {props.tableTitles.map((item) => {
          return <th key={item} scope="col">
          <Translate text={item}></Translate></th>;
        })}
      </tr>
    </thead>
  );
}
