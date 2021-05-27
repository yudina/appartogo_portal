import React from "react";
import { LoadingOverlay, Spinner } from "./LoaderStyles";

export const Loader = ({ size = "small", fixed = false }) => (
  <Spinner size={size} />
  // <LoadingOverlay fixed={fixed}>
  //   <Spinner size={size} />
  // </LoadingOverlay>
);
