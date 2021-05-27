import React, { Component } from "react";
import { faEnvelopeOpenText, faBuilding, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row } from "react-bootstrap";

import "./TenantDashboard.css";
import { Card, CardBody, CardTitle } from "reactstrap";
import { ApplicationsHistoryTable } from "../ApplicationsHistory/ApplicationsHistoryTable";
import { Link } from "react-router-dom";
import { Translate, Translator } from "react-translated";

export class TenantDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = { numberOfApplications: 0, numberOfUnreadMessages: 0 };
  }

  setNumberOfApplications = (applications) => {
    this.setState({ numberOfApplications: applications });
  };

  render() {
    return (
      <div className="mb-5">
        <div className="col-12 border-bottom mb-5">
          <h3>
            <Translate text="Welcome"></Translate>
          </h3>
        </div>
        <Container>
          <Row className="mt-3 d-flex justify-content-center">
            <Col md="6">
              <div className="card-counter primary">
                <i>
                  <FontAwesomeIcon icon={faBuilding} className="fa-lg" />
                </i>

                <span className="count-numbers">{this.state.numberOfApplications}</span>
                <span className="count-name">
                  <Translate text="Rental applications"></Translate>
                </span>
              </div>
            </Col>

            {/* <Col md="6">
              <div className="card-counter success">
                <i>
                  <FontAwesomeIcon icon={faEnvelopeOpenText} className="fa-lg" />
                </i>

                <span className="count-numbers">{this.state.numberOfUnreadMessages}</span>
                <span className="count-name">Unread Messages</span>
              </div>
            </Col> */}
          </Row>

          <Translator>
            {({ translate }) => (
              <Row>
                <Col lg={12}>
                  <hr
                    className="hr-text mt-5 mb-4"
                    data-content={translate({
                      text: "Submitted Applications",
                    })}
                  />
                </Col>
              </Row>
            )}
          </Translator>

          <Row>
            <Col lg={12}>
              <Card className="mb-3 p-2">
                <CardBody>
                  <CardTitle className="mb-1 d-flex">
                    <h6>
                      <Translate text="Latest Submitted Applications"></Translate>
                    </h6>
                    <Link to="/applications-history" size="sm" className="pt-0 ml-auto">
                      <Translate text="View All"></Translate>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Link>
                  </CardTitle>
                </CardBody>

                <ApplicationsHistoryTable
                  updateApplicationsCountWidget={this.setNumberOfApplications}
                  renderedOnDashboard={true}
                  {...this.props}
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
