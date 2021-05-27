import React, { useState, useEffect } from "react";
import { faEdit, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Container, Row, Card, Col, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditAddress from "./EditProfileModals/EditAddress";
import EditPhone from "./EditProfileModals/EditPhone";
import { Loader } from "../../../Loader/Loader";
import Axios from "axios";
import { Translate } from "react-translated";

export default function ViewProfile(props) {
  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  const [userDetailsLoading, setUserDetailsLoading] = useState(true);
  const [userDetailsError, setUserDetailsError] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [userAddressLoading, setUserAddressLoading] = useState(true);
  const [userAddressError, setUserAddressError] = useState(false);
  const [userAddress, setUserAddress] = useState({
    civic: "",
    street: "",
    apart: "",
    city: "",
    province: "",
    postalcode: "",
  });

  const [userAccountData, setUserAccountData] = useState({});

  const handleClosePhoneEdit = () => setShowPhoneEdit(false);
  const handleShowPhoneEdit = () => setShowPhoneEdit(true);

  const handleCloseAddressEdit = () => setShowAddressEdit(false);
  const handleShowAddressEdit = () => setShowAddressEdit(true);

  const fetchData = async () => {
    if (props.auth.getAccountId()) {
      // fetch user profile
      const firstResponse = await Axios.get(`/Account/${props.auth.getAccountId()}`).catch(
        function (error) {
          console.log(error);
        }
      );

      setUserDetailsLoading(false);

      if (firstResponse && firstResponse.data) {
        setUserDetails({
          firstname: firstResponse.data.firstName,
          lastname: firstResponse.data.lastName,
          email: firstResponse.data.email,
          phone: firstResponse.data.phoneNumber,
        });

        // GET ADDRESS
        setUserAccountData(firstResponse.data);
        const urlToGetAddress = `/Address/${firstResponse.data.addressId}`;
        const secondResponse = await Axios.get(urlToGetAddress).catch(function (error) {
          console.log(error);
        });

        setUserAddressLoading(false);

        if (secondResponse && secondResponse.data) {
          // SET ADDRESS
          setUserAddress({
            civic: secondResponse.data.civicNumber,
            street: secondResponse.data.streetName,
            apart: secondResponse.data.apartmentNumber,
            city: secondResponse.data.city,
            province: secondResponse.data.state,
            postalcode: secondResponse.data.postalCode,
          });
        } else {
          setUserAddressError(true);
        }
      } else {
        setUserDetailsError(true);
        setUserAddressError(true);
        setUserAddressLoading(false);
      }
    } else {
      setUserDetailsError(true);
      setUserDetailsLoading(false);
      setUserAddressError(true);
      setUserAddressLoading(false);
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
        <Col xl={12} className="mb-5 d-flex justify-content-center">
          <FontAwesomeIcon icon={faUser} className="fa-10x text-muted" />
        </Col>
      </Row>
      <Row>
        <Col xl={12} className="mb-2 d-flex">
          <h6>
            <Translate text="Profile"></Translate>
          </h6>
        </Col>
      </Row>
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Card.Title className="ml-2 mr-2 mb-4">
                <Row>
                  <h5>
                    <Translate text="Personal Details" />
                  </h5>
                  {!userDetailsError && (
                    <Link size="sm" className="ml-auto" onClick={handleShowPhoneEdit}>
                      <h6>
                        <Translate text="Edit Phone" /> <FontAwesomeIcon icon={faEdit} />
                      </h6>
                    </Link>
                  )}
                </Row>
              </Card.Title>
              {userDetailsLoading ? (
                <Loader />
              ) : userDetailsError ? (
                <span>
                  <Translate text="An error has occured." />
                </span>
              ) : (
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} xl="4">
                      <Form.Label>
                        <Translate text="First Name" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={userDetails.firstname}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} xl="4">
                      <Form.Label>
                        <Translate text="Last Name" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={userDetails.lastname}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} xl="4">
                      <Form.Label>
                        <Translate text="Phone Number" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={userDetails.phone}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} xl="12">
                      <Form.Label>
                        <Translate text="Email Address" />
                      </Form.Label>
                      <Col>
                        <Form.Control
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          defaultValue={userDetails.email}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Card.Title className="ml-2 mr-2 mb-4">
                <Row>
                  <h5>
                    <Translate text="Address Details" />
                  </h5>
                  {!userAddressError && (
                    <Link size="sm" className="pt-0 ml-auto" onClick={handleShowAddressEdit}>
                      <h6>
                        <Translate text="Edit Address" /> <FontAwesomeIcon icon={faEdit} />
                      </h6>
                    </Link>
                  )}
                </Row>
              </Card.Title>
              {userAddressLoading ? (
                <Loader />
              ) : userAddressError ? (
                <span>
                  <Translate text="An error has occured." />
                </span>
              ) : (
                <Form>
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
                          defaultValue={userAddress.civic}
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
                          defaultValue={userAddress.street}
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
                          defaultValue={userAddress.apart}
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
                          defaultValue={userAddress.city}
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
                          defaultValue={userAddress.province}
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
                          defaultValue={userAddress.postalcode}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        size="m"
        show={showPhoneEdit}
        onHide={handleClosePhoneEdit}
        backdrop="static"
        keyboard={false}
      >
        <EditPhone {...props} userAccount={userAccountData} closeModal={handleClosePhoneEdit} />
      </Modal>
      <Modal
        size="xl"
        show={showAddressEdit}
        onHide={handleCloseAddressEdit}
        backdrop="static"
        keyboard={false}
      >
        <EditAddress {...props} userAccount={userAccountData} closeModal={handleCloseAddressEdit} />
      </Modal>
    </Container>
  );
}
