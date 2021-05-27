import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Loader } from "../Loader/Loader";

export default function AuthCallback(props) {
  // This route is invoked after login completed
  useEffect(() => {
    props.auth.handleRedirectPromise();
  }, []);

  return (
    <Row>
      <Col lg={12} className="mt-3 d-flex justify-content-center">
        <Loader></Loader>
      </Col>
    </Row>
  );
}
