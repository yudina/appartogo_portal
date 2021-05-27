import styled, { css, keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
`;

export const LoadingOverlay = styled.div`
  position: ${(props) => (props.fixed ? "fixed" : "absolute")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.fixed ? "100vw" : "100&")};
  height: ${(props) => (props.fixed ? "100vh" : "100&")};
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 999;
  top: 0;
  left: 0;
`;

export const Spinner = styled.div`
  animation: 0.8s ease-in-out infinite ${rotate};
  background: transparent;
  border-color: #3498db;
  border-radius: 50%;
  border-style: solid;
  border-width: 6px;
  border-top-color: #ecf0f1;
  width: 80px;
  height: 80px;

  // Added this:
  margin: auto;

  ${(props) =>
    props.size &&
    props.size === "large" &&
    css`
      width: 112px;
      height: 112px;
    `}

  ${(props) =>
    props.size &&
    props.size === "small" &&
    css`
      width: 54px;
      height: 54px;
      border-width: 4px;
    `}
`;
