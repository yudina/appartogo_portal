import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { Loader } from "../../Loader/Loader";
import { Translate, Translator } from "react-translated";

export class TenantHousing extends Component {
  constructor(props) {
    super(props);

    this.state = { address: [], loading: true, error: false, notTenant: false };
  }

  async componentDidMount() {
    if (this.props.auth.accountJSON) {
      const firstResponse = await Axios.get(
        `/Tenant/byaccountid/${this.props.auth.getAccountId()}`
      ).catch(function (error) {
        this.setState({ error: true, loading: false, rooms: "", bathrooms: "", size: "" });
        console.log(error);
      });

      if (firstResponse && firstResponse.status === 200) {
        if (firstResponse.data && firstResponse.data.length > 0) {
          const tenantWithActiveLease = firstResponse.data.find((x) => x.activeLease === true);

          if (tenantWithActiveLease) {
            // There is an active lease, find the apartment to this tenant
            const secondResponse = await Axios.get(`/Apartment/`).catch(function (error) {
              this.setState({ error: true, loading: false });
              console.log(error);
            });

            if (secondResponse && secondResponse.data && secondResponse.data.length > 0) {
              // find the apartment that has the tenantid with an activelease
              const apartment = secondResponse.data.find((apartment) => {
                return apartment.tenantId === tenantWithActiveLease.id;
              });

              if (apartment && apartment.propertyId) {
                const thirdResponse = await Axios.get(`/Property/${apartment.propertyId}`).catch(
                  function (error) {
                    this.setState({ error: true, loading: false });
                    console.log(error);
                  }
                );

                if (thirdResponse && thirdResponse.data) {
                  // now i have the property, get the address
                  const fourthResponse = await Axios.get(
                    `/Address/${thirdResponse.data.addressId}`
                  ).catch(function (error) {
                    this.setState({ error: true, loading: false });
                    console.log(error);
                  });

                  if (fourthResponse && fourthResponse.data) {
                    this.setState({
                      address: fourthResponse.data,
                      rooms: apartment.rooms,
                      bathrooms: apartment.bathrooms,
                      size: apartment.size,
                      loading: false,
                    });
                  } else {
                    this.setState({ error: true, loading: false });
                  }
                } else {
                  this.setState({ error: true, loading: false });
                }
              } else {
                this.setState({ error: true, loading: false });
              }
            } else {
              this.setState({ error: true, loading: false });
            }
          } else {
            this.setState({ notTenant: true, loading: false });
          }
        } else {
          this.setState({ notTenant: true, loading: false });
        }
      } else {
        this.setState({ error: true, loading: false });
      }
    }
  }

  render() {
    return (
      <div>
        <div className="col-12 border-bottom mb-4">
          <h3>
            <Translate text="My Housing"></Translate>
          </h3>
        </div>
        <Row>
          <Col lg={3} className="mt-3 d-flex justify-content-center">
            <FontAwesomeIcon icon={faHouseUser} className="fa-10x text-muted" />
          </Col>

          <Col lg={9} className="mt-5 pl-3">
            <div className="w-100">
              {!this.state.error && !this.state.notTenant && (
                <h4>
                  <Translate text="Your address" />
                </h4>
              )}
              {this.state.loading && <Loader />}
              {!this.state.error && !this.state.notTenant && (
                <h6>
                  {this.state.address.civicNumber} {this.state.address.streetName}
                  {this.state.address.apartmentNumber
                    ? " #" + this.state.address.apartmentNumber
                    : ""}
                  , {this.state.address.city}, {this.state.address.state},{" "}
                  {this.state.address.country}, {this.state.address.postalCode}
                </h6>
              )}
              <br></br>
              <h4>
                <Translate text="Apartment details" />
              </h4>
              {!this.state.error && !this.state.notTenant && (
                <div>
                  <h6>
                    <Translate text="Size: " />
                    {this.state.size}
                  </h6>
                  <h6>
                    <Translate text="Rooms: " />
                    {this.state.rooms}
                  </h6>
                  <h6>
                    <Translate text="Bathrooms: " />
                    {this.state.bathrooms}
                  </h6>
                </div>
              )}
              {this.state.notTenant && (
                <span>
                  <Translate text="Your don't have an active lease yet."></Translate>
                </span>
              )}
              {this.state.error && (
                <span>
                  <Translate text="An error has occured."></Translate>
                </span>
              )}
            </div>
          </Col>
        </Row>
        <Translator>
          {({ translate }) => (
            <hr
              className="hr-text mt-5 mb-4"
              data-content={translate({
                text: "Lease of the dwelling agreements",
              })}
            />
          )}
        </Translator>
        <Row>
          <Col lg={12} className="mt-3 d-flex justify-content-center">
            <Translate text="digital lease goes here"></Translate>
          </Col>
        </Row>
      </div>
    );
  }
}
