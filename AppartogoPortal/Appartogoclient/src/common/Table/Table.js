import React from "react";

export default function Table(props) {
  return (
    <thead>
      <tr>
        {props.tableTitles.map((item) => {
          return <th scope="col">{item}</th>;
        })}
      </tr>
    </thead>
  );
}
