import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ApplicationsHistoryTable } from "./ApplicationsHistoryTable";
import "./ApplicationsHistory.css";

import "./DashboardTenant.css";
import { Translate } from "react-translated";

const ApplicationsHistory = (props) => {
  return (
    <div>
      <div className="col-12 border-bottom">
        <h3>
          <Translate text="Applications History"></Translate>
        </h3>
      </div>
      <Container className="contain mb-5">
        <Row className="mb-2">
          <Col lg={12}>
            <div className="description mb-5">
              <Translate text="Below you can find the history of your submitted applications for a dwelling. Select any row to display more details."></Translate>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ApplicationsHistoryTable renderedOnDashboard={false} {...props} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ApplicationsHistory;
