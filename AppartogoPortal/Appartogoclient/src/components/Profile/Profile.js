import React, { Component } from "react";
import { Nav, Row, Tab, Col, Container } from "react-bootstrap";
import ViewProfile from "./TabsContent/ViewProfile/ViewProfile";
import ViewOrganization from "./TabsContent/ViewProfile/ViewOrganization";
import { Translate } from "react-translated";

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "profile",
    };
  }

  componentDidMount() {
    if (window.location.hash) {
      if (window.location.hash.match("#organization")) {
        this.setState({ tab: "organization" });
      }
    }
  }

  handleTabClick = (key) => {
    this.setState({ tab: key });
  };

  render() {
    return (
      <div>
        <div className="col-12 border-bottom">
          <h3>
            <Translate text="Account settings" />
          </h3>
        </div>
        <Tab.Container id="left-tabs" activeKey={this.state.tab} onSelect={this.handleTabClick}>
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column mt-4">
                <Nav.Item>
                  <Nav.Link eventKey="profile">
                    <Translate text="Profile" />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="organization">
                    <Translate text="Organization" />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content className="mt-5">
                <Tab.Pane eventKey="profile" className="mb-5">
                  <ViewProfile {...this.props}></ViewProfile>
                </Tab.Pane>
                <Tab.Pane eventKey="organization" className="mb-5">
                  <ViewOrganization {...this.props}></ViewOrganization>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}
