import React from "react";

import { Translate } from "react-translated";

export default function StatusIndicator({ status, firstFlag, secondFlag }) {
  const statusStyle = { color: "#4d88ff" };
  const style = {
    borderStyle: "none",
    borderRadius: "0.2rem 0.2rem 0.2rem 0.2rem",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor:
      status === firstFlag
        ? "#c0f2c9"
        : status === secondFlag
        ? "#f2c0c0"
        : "#98bef2",
    color:
      status === firstFlag
        ? "#00cc00"
        : status === secondFlag
        ? "#ff0000"
        : "#4d88ff",
    padding: "0.4rem",
  };
  let statusToshow = "New";
  if (status === firstFlag) {
    if (firstFlag === 1) firstFlag = "Accepted";
    statusToshow = firstFlag;
    statusStyle.color = "#00cc00";
  } else if (status === secondFlag) {
    if (secondFlag === 2) secondFlag = "Rejected";
    statusToshow = secondFlag;
    statusStyle.color = "#ff0000";
  }
  return (
    <div className="textContainer" style={style}>
      <Translate
        text={statusToshow === "New" ? "Neww" : statusToshow}
      ></Translate>
    </div>
  );
}
