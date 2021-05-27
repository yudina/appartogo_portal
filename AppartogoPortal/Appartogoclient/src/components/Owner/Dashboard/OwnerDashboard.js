import React, { Component } from "react";
import {
  faAd,
  faClipboardCheck,
  faBuilding,
  faUsers,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row, Card } from "react-bootstrap";
import "./OwnerDashboard.css";
import PropertyService from "../../../services/PropertyService";
import ListingsService from "../../../services/ListingsService";
import TenantsService from "../../../services/TenantsService";
import AppartementsService from "../../../services/AppartementsService";
import ApplicationsService from "../../../services/ApplicationsService";
import OrganizationService from "../../../services/OrganizationService";
import { Link } from "react-router-dom";
import { Translate } from "react-translated";
import { ToastContainer } from "react-toastify";
import { Loader } from "../../Loader/Loader";
import { errorToast } from "../../../common/Toast";
import PageHeader from "../../../common/PageHeader";

class OwnerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: this.props.auth.getAccountId(),
      listingsCounter: 0,
      buildingsCounter: 0,
      applicationsCounter: 0,
      tenantsCounter: 0,
      error: null,
      isLoading: false,
    };
  }
  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const organization = await OrganizationService.fetchOrganisation(
        this.state.accountId
      );
      if (organization.data && organization.data.length > 0) {
        const organizationId = organization.data.organizationId;
        const properties = await PropertyService.fetchProperties(
          organizationId
        );
        if (properties.data.length > 0) {
          this.setState({ buildingsCounter: properties.data.length });
          const appartements = await AppartementsService.fetchAppartments(
            properties.data
          );
          if (appartements.data.length > 0) {
            const results = await Promise.all([
              ListingsService.fetchListings(appartements.data),
              TenantsService.fetchTenants(appartements.data),
            ]);
            const listings = results[0];
            const tenants = results[1];
            if (listings.data.length > 0) {
              this.setState({ listingsCounter: listings.data.length });
              let applications = await ApplicationsService.fetchApplications(
                listings.data
              );
              if (applications.data.length > 0) {
                this.setState({
                  applicationsCounter: applications.data.length,
                });
              }
            }
            if (tenants.data.length > 0) {
              this.setState({ tenantsCounter: tenants.data.length });
            }
          }
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      errorToast(<Translate text="Loading data error"></Translate>, 4000);
      this.setState({ error: true, isLoading: false });
    }
  }

  render() {
    const {
      error,
      isLoading,
      listingsCounter,
      buildingsCounter,
      applicationsCounter,
      tenantsCounter,
    } = this.state;
    if (error) {
      return (
        <div>
          <ToastContainer />
        </div>
      );
    } else if (isLoading) {
      return (
        <div>
          <PageHeader headerName="Welcome" />
          <div>
            <Loader size="medium" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-5">
          <PageHeader headerName="Welcome" />
          <Container>
            <Row className="mb-5">
              <Col md="3">
                <div className="card-counter danger">
                  <i>
                    <FontAwesomeIcon icon={faAd} />
                  </i>

                  <span className="count-numbers">{listingsCounter}</span>
                  <span className="count-name">
                    <Translate text="Active Ads"></Translate>
                  </span>
                </div>
              </Col>

              <Col md="3">
                <div className="card-counter primary">
                  <i>
                    <FontAwesomeIcon icon={faBuilding} />
                  </i>

                  <span className="count-numbers">{buildingsCounter}</span>
                  <span className="count-name">
                    <Translate text="Buildings"></Translate>
                  </span>
                </div>
              </Col>

              <Col md="3">
                <div className="card-counter success">
                  <i>
                    <FontAwesomeIcon icon={faClipboardCheck} />
                  </i>

                  <span className="count-numbers">{applicationsCounter}</span>
                  <span className="count-name">
                    <Translate text="Applicants"></Translate>
                  </span>
                </div>
              </Col>

              <Col md="3">
                <div className="card-counter info">
                  <i>
                    <FontAwesomeIcon icon={faUsers} />
                  </i>

                  <span className="count-numbers">{tenantsCounter}</span>
                  <span className="count-name">
                    <Translate text="Tenants"></Translate>
                  </span>
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={6} className="d-flex mt-3">
                <Card className="w-100">
                  <Card.Body>
                    <Link to="/applications" className="pull-right">
                      <Translate text="View"></Translate>{" "}
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Link>
                    <Card.Title>
                      <Translate text="Rental Applicants"></Translate>
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      <Translate text="View Applicants"></Translate>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="d-flex mt-3">
                <Card className="w-100">
                  <Card.Body>
                    <Link to="/ads" className="pull-right">
                      <Translate text="View"></Translate>{" "}
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Link>
                    <Card.Title>
                      <Translate text="My Ads"></Translate>
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      <Translate text="View Ads"></Translate>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={6} className="d-flex mt-3">
                <Card className="w-100">
                  <Card.Body>
                    <Link to="/buildings" className="pull-right">
                      <Translate text="View"></Translate>{" "}
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Link>
                    <Card.Title>
                      <Translate text="My Buildings"></Translate>
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      <Translate text="View Buildings"></Translate>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="d-flex mt-3">
                <Card className="w-100">
                  <Card.Body>
                    <Link to="/tenants" className="pull-right">
                      <Translate text="View"></Translate>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Link>
                    <Card.Title>
                      <Translate text="My Tenants"></Translate>
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      <Translate text="View Tenants"></Translate>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default OwnerDashboard;
