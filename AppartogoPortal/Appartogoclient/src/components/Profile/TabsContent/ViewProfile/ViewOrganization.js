import React, { useState, useEffect } from "react";
import { faEdit, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Container, Row, Card, Col, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditOrganization from "./EditProfileModals/EditOrganization";
import { Loader } from "../../../Loader/Loader";
import Axios from "axios";
import { Translate } from "react-translated";

export default function ViewOrganization(props) {
  const [showOrganizationEdit, setShowOrganizationEdit] = useState(false);

  const [organizationExist, setOrganizationExist] = useState(false);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [organizationError, setOrganizationError] = useState(false);
  const [organization, setOrganization] = useState({
    name: "",
    civic: "",
    street: "",
    apart: "",
    city: "",
    province: "",
    postalcode: "",
  });

  const [userOrganizationData, setUserOrganizationData] = useState({});

  const handleCloseOrganizationEdit = () => setShowOrganizationEdit(false);
  const handleShowOrganizationEdit = () => setShowOrganizationEdit(true);

  const fetchData = async () => {
    if (props.auth.getAccountId()) {
      // Firstly, fetch all applications done by the user
      const firstResponse = await Axios.get(`/Account/${props.auth.getAccountId()}`).catch(
        function (error) {
          console.log(error);
        }
      );

      if (firstResponse && firstResponse.data) {
        // GET ORGANIZATION
        const urlToGetOrganizationArray = `/OrganizationAccount/byaccountid/${firstResponse.data.id}`;
        const thirdResponse = await Axios.get(urlToGetOrganizationArray).catch(function (error) {
          console.log(error);
        });

        if (thirdResponse && thirdResponse.data.length > 0) {
          const urlToGetOrganization = `/Organization/${thirdResponse.data[0].organizationId}`;
          const fourthResponse = await Axios.get(urlToGetOrganization).catch(function (error) {
            console.log(error);
          });

          if (fourthResponse && fourthResponse.data) {
            const urlToGetOrganizationAddress = `/Address/${fourthResponse.data.addressId}`;
            const fifthResponse = await Axios.get(urlToGetOrganizationAddress).catch(function (e) {
              console.log(e);
            });

            setOrganizationLoading(false);

            // SET ORGANIZATION
            if (fifthResponse && fifthResponse.data) {
              setOrganization({
                name: fourthResponse.data.name,
                civic: fifthResponse.data.civicNumber,
                street: fifthResponse.data.streetName,
                apart: fifthResponse.data.apartmentNumber,
                city: fifthResponse.data.city,
                province: fifthResponse.data.state,
                postalcode: fifthResponse.data.postalCode,
              });

              setOrganizationExist(true);
              setUserOrganizationData(fourthResponse.data);
            } else {
              setOrganizationError(true);
            }
          } else {
            setOrganizationLoading(false);
            setOrganizationError(true);
          }
        } else {
          setOrganizationLoading(false);
          if (thirdResponse) setOrganizationExist(false);
          else setOrganizationError(true);
        }
      } else {
        setOrganizationError(true);
        setOrganizationLoading(false);
      }
    } else {
      setOrganizationError(true);
      setOrganizationLoading(false);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      await fetchData();
    };
    getProfile();
  }, []);

  return (
    <Container>
      <Row>
        <Col xl={12}>
          <h6>
            <Translate text="Organization"></Translate>
          </h6>
        </Col>
      </Row>

      {/* ORGANIZATION */}
      {organizationLoading ? (
        <Loader />
      ) : organizationExist ? (
        <Row className="mt-2">
          <Col xl={12}>
            <Card>
              <Card.Body>
                <Card.Title className="ml-2 mr-2 mb-4">
                  <Row>
                    <h5 className="d-flex justify-content-center">
                      <Translate text="Organization Details" />
                    </h5>
                    {!organizationError && (
                      <Link size="sm" className="pt-0 ml-auto" onClick={handleShowOrganizationEdit}>
                        <h6>
                          <Translate text="Edit Organization" /> <FontAwesomeIcon icon={faEdit} />
                        </h6>
                      </Link>
                    )}
                  </Row>
                </Card.Title>
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} xl="12">
                      <Form.Label>
                        <Translate text="Organization" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={organization.name}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} xl="2">
                      <Form.Label>
                        <Translate text="Civic #" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={organization.civic}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} xl="8">
                      <Form.Label>
                        <Translate text="Street name" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={organization.street}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} xl="2">
                      <Form.Label>
                        <Translate text="Apart." />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={organization.apart}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} xl="6">
                      <Form.Label>
                        <Translate text="City" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={organization.city}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} xl="3">
                      <Form.Label>
                        <Translate text="Province" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={organization.province}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} xl="3">
                      <Form.Label>
                        <Translate text="Postal Code" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={organization.postalcode}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="mt-2">
          <Col xl={12}>
            <Card>
              <Card.Body>
                <Card.Title className="ml-2 mr-2 mb-4">
                  <Row>
                    <h5>
                      <Translate text="Organization Details" />
                    </h5>
                    {!organizationError && (
                      <Link size="sm" className="pt-0 ml-auto" onClick={handleShowOrganizationEdit}>
                        <h6>
                          <Translate text="Add Organization" /> <FontAwesomeIcon icon={faEdit} />
                        </h6>
                      </Link>
                    )}
                  </Row>
                </Card.Title>
                {organizationError ? (
                  <span>
                    <Translate text="An error has occured." />
                  </span>
                ) : (
                  <span>
                    <Translate text="You don't have any organization." />
                  </span>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <div id="organization"></div>

      <Modal
        size="xl"
        show={showOrganizationEdit}
        onHide={handleCloseOrganizationEdit}
        backdrop="static"
        keyboard={false}
      >
        <EditOrganization
          {...props}
          userOrganization={userOrganizationData}
          closeModal={handleCloseOrganizationEdit}
        />
      </Modal>
    </Container>
  );
}
