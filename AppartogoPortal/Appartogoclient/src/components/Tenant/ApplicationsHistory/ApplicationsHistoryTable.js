import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import moment from "moment";
import _ from "lodash";

import { Badge, Button, ButtonGroup, Row, Col } from "reactstrap";
import { CustomSearch } from "./CustomTableComponents/CustomSearch";
import { CustomPaginationPanel } from "./CustomTableComponents/CustomPaginationPanel";
import { CustomSizePerPageButton } from "./CustomTableComponents/CustomSizePerPageButton";
import { CustomPaginationTotal } from "./CustomTableComponents/CustomPaginationTotal";

import { faAngleDown, faAngleRight, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Loader } from "../../Loader/Loader";
import Documents from "./Documents";
import { Translate } from "react-translated";
import { createColumnDefinitions, createColumnDefinitionsFr } from "./ColumnsDefinitions";

const renameKey = (object, key, newKey) => {
  const clonedObj = Object.assign({}, object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
};

export class ApplicationsHistoryTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
      renderedOnDashboard: this.props.renderedOnDashboard,
      loading: true,
      error: false,
      noData: false,
    };
  }

  async componentDidMount() {
    if (this.props.auth.getAccountId()) {
      // Firstly, fetch all applications done by the user
      const firstResponse = await Axios.get(
        `/Application/byaccountid/${this.props.auth.getAccountId()}`
      ).catch(function (error) {
        console.log(error);
      });

      let params = "";
      // The server returned a valid response
      if (firstResponse && firstResponse.data.length > 0) {
        firstResponse.data.map((application) => {
          params = params + "ids=" + application.listingId + "&";
        });
        const urlToGetListings = "/Listing/bylist/Listing?" + params;

        // Secondly, fetch all Listings linked to the Applications done by the user
        const secondResponse = await Axios.get(urlToGetListings).catch(function (error) {
          console.log(error);
        });

        // The server returned a valid response
        if (secondResponse && secondResponse.data) {
          let secondResponseNew = [];
          secondResponse.data.map((object) => {
            object = renameKey(object, "id", "listingId");
            secondResponseNew.push(object);
          });

          params = "";
          secondResponseNew.map((listing) => {
            params = params + "ids=" + listing.apartmentId + "&";
          });
          const urlToGetApartments = "/Apartment/bylist/Apartment?" + params;

          // Thirdly, fetch all Apartments linked to the Listings
          const thirdResponse = await Axios.get(urlToGetApartments).catch(function (error) {
            console.log(error);
          });

          // The server returned a valid response
          if (thirdResponse && thirdResponse.data) {
            let thirdResponseNew = [];
            thirdResponse.data.map((object) => {
              object = renameKey(object, "id", "apartmentId");
              thirdResponseNew.push(object);
            });

            params = "";
            thirdResponseNew.map((apartment) => {
              params = params + "ids=" + apartment.propertyId + "&";
            });
            const urlToGetBuildings = "/Property/bylist/Property?" + params;

            // Fourthly, fetch all Buildings linked to the Apartments
            const fourthResponse = await Axios.get(urlToGetBuildings).catch(function (error) {
              console.log(error);
            });

            // The server returned a valid response
            if (fourthResponse && fourthResponse.data) {
              let fourthResponseNew = [];
              fourthResponse.data.map((object) => {
                object = renameKey(object, "id", "propertyId");
                fourthResponseNew.push(object);
              });

              params = "";
              fourthResponseNew.map((address) => {
                params = params + "ids=" + address.addressId + "&";
              });
              const urlToGetAddresses = "/Address/bylist/Address?" + params;

              // Fifthly, fetch all Addresses linked to the Buildings
              const fifthResponse = await Axios.get(urlToGetAddresses).catch(function (error) {
                console.log(error);
              });

              if (fifthResponse && fifthResponse.data) {
                let fifthResponseNew = [];
                fifthResponse.data.map((object) => {
                  object = renameKey(object, "id", "addressId");
                  fifthResponseNew.push(object);
                });

                // Merge everything together to create a big JSON
                let mergeAddressProperty = fourthResponseNew.map((a) =>
                  Object.assign(
                    a,
                    fifthResponseNew.find((b) => b.addressId == a.addressId)
                  )
                );

                let mergeAddressPropertyApartment = thirdResponseNew.map((a) =>
                  Object.assign(
                    a,
                    mergeAddressProperty.find((b) => b.propertyId == a.propertyId)
                  )
                );

                let mergeAddressPropertyApartmentListing = secondResponseNew.map((a) =>
                  Object.assign(
                    a,
                    mergeAddressPropertyApartment.find((b) => b.apartmentId == a.apartmentId)
                  )
                );

                let mergeAddressPropertyApartmentListingApplications = firstResponse.data.map((a) =>
                  Object.assign(
                    a,
                    mergeAddressPropertyApartmentListing.find((b) => b.listingId == a.listingId)
                  )
                );

                console.log(mergeAddressPropertyApartmentListingApplications);

                // sort applications by ascending submission date
                mergeAddressPropertyApartmentListingApplications.sort(function (a, b) {
                  return new Date(b.applicationDate) - new Date(a.applicationDate);
                });

                // map status number to a descriptive word
                this.mapStatusDescription(mergeAddressPropertyApartmentListingApplications);

                // Update widget on dashboard
                this.updateParentDashboardWidget(mergeAddressPropertyApartmentListingApplications);

                this.setState({
                  applications: mergeAddressPropertyApartmentListingApplications,
                  loading: false,
                  noData: false,
                  error: false,
                });
              } else {
                this.setState({ loading: false, error: true });
              }
            } else {
              this.setState({ loading: false, error: true });
            }
          } else {
            this.setState({ loading: false, error: true });
          }
        } else {
          this.setState({ loading: false, error: true });
        }
      } else {
        if (firstResponse) this.setState({ loading: false, noData: true });
        else this.setState({ loading: false, error: true });
      }
    } else {
      this.setState({ loading: false, error: true });
    }
  }

  updateParentDashboardWidget(applications) {
    if (this.props.updateApplicationsCountWidget) {
      this.props.updateApplicationsCountWidget(applications.length);
    }
  }

  mapStatusDescription = (applications) => {
    const status = (statusName) => {
      const map = {
        0: this.props.language === "en" ? "Pending" : "En attente",
        1: this.props.language === "en" ? "Accepted" : "Accepté",
        2: this.props.language === "en" ? "Rejected" : "Rejeté",
      };
      return map[statusName];
    };
    applications.map((e) => {
      e.status = status(e.status);
    });
  };

  render() {
    const columnDefs =
      this.props.language === "en" ? createColumnDefinitions() : createColumnDefinitionsFr();

    const paginationDef = paginationFactory({
      paginationSize: 5,
      showTotal: true,
      pageListRenderer: (props) => (
        <CustomPaginationPanel {...props} size="sm" className="ml-md-auto mt-2 mt-md-0" />
      ),
      sizePerPageRenderer: (props) => <CustomSizePerPageButton {...props} />,
      paginationTotalRenderer: (from, to, size) => (
        <CustomPaginationTotal {...{ from, to, size }} />
      ),
    });

    const expandRow = {
      renderer: (row) => (
        <Row>
          <Col md={6}>
            <dl className="row">
              <dt className="col-sm-6 text-left">
                <Translate text="Rooms count:"></Translate>
              </dt>
              <dd className="col-sm-6">{row.rooms}</dd>

              <dt className="col-sm-6 text-left">
                <Translate text="Bathrooms count:"></Translate>
              </dt>
              <dd className="col-sm-6">{row.bathrooms}</dd>

              <dt className="col-sm-6 text-left">
                <Translate text="Consent for credit check:"></Translate>
              </dt>
              <dd className="col-sm-6">
                {row.consentForCreditCheck ? (
                  <FontAwesomeIcon icon={faCheck} className="fa-sm" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="fa-sm" />
                )}
              </dd>

              <dt className="col-sm-6 text-left">
                <Translate text="Available on:"></Translate>
              </dt>
              <dd className="col-sm-6">{moment(row.availibityDate).format("DD-MMM-YYYY")}</dd>
            </dl>
          </Col>

          <Col md={6}>
            <dl className="row">
              <dt className="col-sm-6 text-left">
                <Translate text="Dwelling City:"></Translate>
              </dt>
              <dd className="col-sm-6">{row.city}</dd>

              <dt className="col-sm-6 text-left">
                <Translate text="Consent for insurance:"></Translate>
              </dt>
              <dd className="col-sm-6">
                {row.wantsRentalInsurance ? (
                  <FontAwesomeIcon icon={faCheck} className="fa-sm" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="fa-sm" />
                )}
              </dd>
              <dt className="col-sm-6 text-left">Documents:</dt>
              <dd className="col-sm-6">
                <Documents applicationId={row.id} {...this.props}></Documents>
              </dd>
            </dl>
          </Col>
        </Row>
      ),
      showExpandColumn: true,
      expandHeaderColumnRenderer: ({ isAnyExpands }) =>
        isAnyExpands ? (
          <FontAwesomeIcon icon={faAngleDown} className="fa-fw fa-lg text-muted" />
        ) : (
          <FontAwesomeIcon icon={faAngleRight} className="fa-fw fa-lg text-muted" />
        ),
      expandColumnRenderer: ({ expanded }) =>
        expanded ? (
          <FontAwesomeIcon icon={faAngleDown} className="fa-fw fa-lg text-muted" />
        ) : (
          <FontAwesomeIcon icon={faAngleRight} className="fa-fw fa-lg text-muted" />
        ),
    };

    return (
      <div>
        {this.state.loading ? <Loader /> : null}
        <div>
          {this.state.renderedOnDashboard ? (
            <ToolkitProvider
              keyField="id"
              data={this.state.applications.slice(0, 3)}
              columns={columnDefs}
              search
            >
              {(props) => (
                <React.Fragment>
                  <BootstrapTable
                    classes="table-responsive-lg"
                    bordered={false}
                    responsive
                    hover
                    {...props.baseProps}
                  />
                </React.Fragment>
              )}
            </ToolkitProvider>
          ) : (
            <div
              style={{
                background: "white",
                padding: "14px",
                borderRadius: "8px",
              }}
              className="shadow"
            >
              <ToolkitProvider
                keyField="id"
                data={this.state.applications}
                columns={columnDefs}
                search
              >
                {(props) => (
                  <React.Fragment>
                    <div className="d-flex justify-content-end align-items-center mb-2">
                      <h5 className="my-0 mr-2">
                        <Translate text="History"></Translate>
                      </h5>
                      <div className="d-flex ml-auto">
                        <CustomSearch className="mr-2" {...props.searchProps} />
                      </div>
                    </div>
                    <BootstrapTable
                      classes="table-responsive-lg"
                      pagination={paginationDef}
                      bordered={false}
                      expandRow={expandRow}
                      responsive
                      hover
                      {...props.baseProps}
                    />
                  </React.Fragment>
                )}
              </ToolkitProvider>
            </div>
          )}
        </div>
        {this.state.noData && (
          <span className="d-flex justify-content-center mt-5">
            <Translate text="No applications have been done yet."></Translate>
          </span>
        )}
        {this.state.error && (
          <span className="d-flex justify-content-center">
            <Translate text="An error has occured."></Translate>
          </span>
        )}
      </div>
    );
  }
}
