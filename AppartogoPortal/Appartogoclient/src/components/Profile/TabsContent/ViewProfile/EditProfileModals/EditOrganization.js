import React, { useState } from "react";
import { Formik } from "formik";
import { Modal, Row, Card, Form, Button, Col } from "react-bootstrap";
import Axios from "axios";
import { organizationSchema, organizationSchemaFr } from "../../../constants/AccountSchema";
import { Translate } from "react-translated";

export default function EditOrganization(props) {
  const [error, setError] = useState(false);

  const handleSubmit = async (evt) => {
    const isValid = await organizationSchema.validate(evt);
    if (!isValid) {
      return;
    } else {
      if (Object.keys(props.userOrganization).length === 0) {
        /* CREATE NEW ORGANIZATION IN DB */
        if (props.auth.getAccountId()) {
          const organizationAddressBody = {
            CivicNumber: evt.orgCivicNumber,
            StreetName: evt.orgStreet,
            City: evt.orgCity,
            PostalCode: evt.orgPostalCode,
            Country: "Canada",
            State: evt.orgProvince,
            ApartmentNumber: evt.orgApart ? evt.orgApart : "",
          };

          // Add new organization address
          const orgAddressResponse = await Axios.post("/Address", organizationAddressBody).catch(
            function (error) {
              console.log(error);
            }
          );

          if (orgAddressResponse && orgAddressResponse.status === 200 && orgAddressResponse.data) {
            const organizationBody = {
              addressId: orgAddressResponse.data,
              name: evt.organisationName,
            };

            // Add new organization to DB
            const organizationResponse = await Axios.post("/Organization", organizationBody).catch(
              function (error) {
                console.log(error);
              }
            );

            if (
              organizationResponse &&
              organizationResponse.status === 200 &&
              organizationResponse.data
            ) {
              const organizationAccountBody = {
                accountId: props.auth.getAccountId(),
                organizationId: organizationResponse.data,
              };

              // Add new association user-organization to DB
              const organizationAccountResponse = await Axios.post(
                "/OrganizationAccount",
                organizationAccountBody
              ).catch(function (error) {
                console.log(error);
              });

              if (organizationAccountResponse && organizationAccountResponse.status === 200) {
                props.closeModal();
                window.location.reload();
              } else {
                setError(true);
              }
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        }
      } else {
        /* EDIT EXISTING USER ORGANIZATION IN DB */
        const addressBody = {
          Id: props.userOrganization.addressId,
          CivicNumber: evt.orgCivicNumber,
          StreetName: evt.orgStreet,
          City: evt.orgCity,
          PostalCode: evt.orgPostalCode,
          Country: "Canada",
          State: evt.orgProvince,
          ApartmentNumber: evt.orgApart ? evt.orgApart : "",
        };

        const addressResponse = await Axios.put("/Address", addressBody).catch(function (e) {
          console.log(e);
        });

        if (addressResponse && addressResponse.status === 200) {
          const orgBody = {
            Id: props.userOrganization.id,
            AddressId: props.userOrganization.addressId,
            Name: evt.organisationName,
          };

          const orgResponse = await Axios.put("/Organization", orgBody).catch(function (e) {
            console.log(e);
          });

          if (orgResponse && orgResponse.status === 200) {
            props.closeModal();
            window.location.reload();
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      }
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          <Translate text="Organization" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-5 justify-content-md-center">
          <Col lg={12}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title tag="h6" className="mb-4">
                  <Translate text="Fill your organization details" />
                </Card.Title>
                <Formik
                  validationSchema={() => {
                    return props.language === "en" ? organizationSchema : organizationSchemaFr;
                  }}
                  onSubmit={handleSubmit}
                  initialValues={{
                    organisationName: "",
                    orgCivicNumber: "",
                    orgStreet: "",
                    orgApart: "",
                    orgCity: "",
                    orgProvince: "",
                    orgPostalCode: "",
                  }}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    isInvalid,
                    errors,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Row>
                        <Form.Group as={Col} md="12" controlId="organisationName">
                          <Form.Label>
                            <Translate text="Organization name" />
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="organisationName"
                            value={values.organisationName}
                            onChange={handleChange}
                            isInvalid={touched.organisationName && errors.organisationName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.organisationName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="2" controlId="orgCivicNumber">
                          <Form.Label>
                            <Translate text="Civic #" />
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="orgCivicNumber"
                            value={values.orgCivicNumber}
                            onChange={handleChange}
                            isInvalid={touched.orgCivicNumber && errors.orgCivicNumber}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.orgCivicNumber}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="8" controlId="orgStreet">
                          <Form.Label>
                            <Translate text="Street name" />
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="orgStreet"
                            value={values.orgStreet}
                            onChange={handleChange}
                            isInvalid={touched.orgStreet && errors.orgStreet}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.orgStreet}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="2" controlId="orgApart">
                          <Form.Label>
                            <Translate text="Apart." />
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="orgApart"
                            value={values.orgApart}
                            onChange={handleChange}
                            isInvalid={touched.orgApart && errors.orgApart}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.orgApart}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="6" controlId="orgCity">
                          <Form.Label>
                            <Translate text="City" />
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="orgCity"
                            value={values.orgCity}
                            onChange={handleChange}
                            isInvalid={touched.orgCity && errors.orgCity}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.orgCity}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="orgProvince">
                          <Form.Label>
                            <Translate text="Province" />
                          </Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue="..."
                            name="orgProvince"
                            value={values.orgProvince}
                            onChange={handleChange}
                            isInvalid={touched.orgProvince && errors.orgProvince}
                          >
                            <option>...</option>
                            <option>AB</option>
                            <option>BC</option>
                            <option>MB</option>
                            <option>NB</option>
                            <option>NL</option>
                            <option>NS</option>
                            <option>NT</option>
                            <option>NU</option>
                            <option>ON</option>
                            <option>PE</option>
                            <option>QC</option>
                            <option>SK</option>
                            <option>YT</option>
                          </Form.Control>

                          <Form.Control.Feedback type="invalid">
                            {errors.orgProvince}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="orgPostalCode">
                          <Form.Label>
                            <Translate text="Postal Code" />
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="orgPostalCode"
                            value={values.orgPostalCode}
                            onChange={handleChange}
                            isInvalid={touched.orgPostalCode && errors.orgPostalCode}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.orgPostalCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>

                      <Button className="d-block mr-0 ml-auto" type="submit">
                        <Translate text="Finish" />
                      </Button>
                      {error && (
                        <span>
                          <Translate text="An error has occured." />
                        </span>
                      )}
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </>
  );
}
