import React, { useState } from "react";
import { Formik } from "formik";
import { Col, Container, Row, Card, Form, Button } from "react-bootstrap";
import Axios from "axios";
import { schema, schemaFr } from "./SetupAccountSchema";
import { Translate, Translator } from "react-translated";
import { Loader } from "../Loader/Loader";

export default function SetupAccount(props) {
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e) => {
    setIsOwner(!isOwner);
  };

  const handleSubmit = async (evt) => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    } else {
      setLoading(true);
      /* ADD USER TO DB */
      const userAddressBody = {
        CivicNumber: evt.civicNumber,
        StreetName: evt.street,
        City: evt.city,
        PostalCode: evt.postalCode,
        Country: "Canada",
        State: evt.province,
        ApartmentNumber: evt.apart ? evt.apart : "",
      };

      // Add new user address
      const userAddressResponse = await Axios.post("/Address", userAddressBody).catch(function (e) {
        console.log(e);
      });

      if (
        props.auth.getAccountId() &&
        userAddressResponse &&
        userAddressResponse.status === 200 &&
        userAddressResponse.data
      ) {
        const accountBody = {
          id: props.auth.getAccountId(),
          addressId: userAddressResponse.data,
          email: props.auth.getUserSignedInDetails().idToken.emails[0],
          firstName: evt.firstName,
          lastName: evt.lastName,
          phoneNumber: evt.phone,
        };

        // Add new user to DB
        const accountResponse = await Axios.post("/Account", accountBody).catch(function (error) {
          console.log(error);
        });

        if (accountResponse && accountResponse.status === 200 && accountResponse.data) {
          /* ADD TENANT TO DB*/
          const tenantBody = {
            AccountId: props.auth.getAccountId(),
          };
          const tenantResponse = await Axios.post("/Tenant", tenantBody).catch(function (error) {
            console.log(error);
          });

          if (!tenantResponse || tenantResponse.status !== 200) {
            setLoading(false);
            setError(true);
          }
          /* ADD ORGANIZATION TO DB*/
          if (isOwner) {
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

            if (
              orgAddressResponse &&
              orgAddressResponse.status === 200 &&
              orgAddressResponse.data
            ) {
              const organizationBody = {
                addressId: orgAddressResponse.data,
                name: evt.organisationName,
              };

              // Add new organization to DB
              const organizationResponse = await Axios.post(
                "/Organization",
                organizationBody
              ).catch(function (error) {
                console.log(error);
              });

              if (
                organizationResponse &&
                organizationResponse.status === 200 &&
                organizationResponse.data
              ) {
                const organizationAccountBody = {
                  accountId: accountResponse.data,
                  organizationId: organizationResponse.data,
                };

                // Add new association user-organization to DB
                const organizationAccountResponse = await Axios.post(
                  "/OrganizationAccount",
                  organizationAccountBody
                ).catch(function (error) {
                  console.log(error);
                });

                window.location.reload();
              } else {
                setLoading(false);
                setError(true);
              }
            } else {
              setLoading(false);
              setError(true);
            }
          } else {
            window.location.reload();
          }
        } else {
          setLoading(false);
          setError(true);
        }
      } else {
        setLoading(false);
        setError(true);
      }
    }
  };

  return (
    <Translator>
      {({ translate }) => (
        <Container className="mb-5">
          <Row className="mb-2">
            <Col lg={12}>
              <div className="d-flex mb-3 mt-4">
                <h1 className="display-4 mr-3 mb-0 align-self-start">
                  <Translate text="Complete Registration"></Translate>
                </h1>
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-5">
                <Translate text="Please fill your details below."></Translate>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <hr
                className="hr-text mt-1 mb-4"
                data-content={translate({
                  text: "User Details",
                })}
              />
            </Col>
          </Row>
          {loading && <Loader />}
          {!loading && (
            <Row className="mb-5 justify-content-md-center">
              <Col lg={12}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title tag="h6" className="mb-4">
                      <Translate text="Fill your details"></Translate>
                    </Card.Title>
                    <Formik
                      validationSchema={() => {
                        return props.language === "en" ? schema : schemaFr;
                      }}
                      onSubmit={handleSubmit}
                      initialValues={{
                        firstName: "",
                        lastName: "",
                        phone: "",
                        civicNumber: "",
                        street: "",
                        apart: "",
                        city: "",
                        province: "",
                        postalCode: "",
                        isOwner: false,
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
                            {/* FIRST ROW */}
                            <Form.Group as={Col} md="4" controlId="firstName">
                              <Form.Label>
                                <Translate text="First Name"></Translate>
                              </Form.Label>

                              <Form.Control
                                type="text"
                                placeholder={translate({
                                  text: "First Name",
                                })}
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                isInvalid={touched.firstName && errors.firstName}
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="lastName">
                              <Form.Label>
                                <Translate text="Last Name"></Translate>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={translate({
                                  text: "Last Name",
                                })}
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                isInvalid={touched.lastName && errors.lastName}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="phone">
                              <Form.Label>
                                <Translate text="Phone Number"></Translate>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="0123456789"
                                name="phone"
                                value={values.phone}
                                onChange={handleChange}
                                isInvalid={touched.phone && errors.phone}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.phone}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Row>
                          <Form.Row>
                            {/* SECOND ROW */}
                            <Form.Group as={Col} md="2" controlId="civicNumber">
                              <Form.Label>
                                <Translate text="Civic #"></Translate>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={translate({
                                  text: "Civic #",
                                })}
                                name="civicNumber"
                                value={values.civicNumber}
                                onChange={handleChange}
                                isInvalid={touched.civicNumber && errors.civicNumber}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.civicNumber}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="8" controlId="street">
                              <Form.Label>
                                <Translate text="Street name"></Translate>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={translate({
                                  text: "Street name",
                                })}
                                name="street"
                                value={values.street}
                                onChange={handleChange}
                                isInvalid={touched.street && errors.street}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.street}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="2" controlId="apart">
                              <Form.Label>
                                <Translate text="Apart."></Translate>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={translate({
                                  text: "Apart.",
                                })}
                                name="apart"
                                value={values.apart}
                                onChange={handleChange}
                                isInvalid={touched.apart && errors.apart}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.apart}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Row>
                          <Form.Row>
                            {/* THIRD ROW */}
                            <Form.Group as={Col} md="6" controlId="city">
                              <Form.Label>
                                <Translate text="City"></Translate>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={translate({
                                  text: "City",
                                })}
                                name="city"
                                value={values.city}
                                onChange={handleChange}
                                isInvalid={touched.city && errors.city}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.city}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="3" controlId="province">
                              <Form.Label>
                                <Translate text="Province"></Translate>
                              </Form.Label>
                              <Form.Control
                                as="select"
                                defaultValue="..."
                                name="province"
                                value={values.province}
                                onChange={handleChange}
                                isInvalid={touched.province && errors.province}
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
                                {errors.province}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="3" controlId="postalCode">
                              <Form.Label>
                                <Translate text="Postal Code"></Translate>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={translate({
                                  text: "Postal Code",
                                })}
                                name="postalCode"
                                value={values.postalCode}
                                onChange={handleChange}
                                isInvalid={touched.postalCode && errors.postalCode}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.postalCode}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Row>

                          {/* ORGANISATION */}
                          <Form.Row>
                            <Form.Group>
                              <Form.Check
                                inline
                                type="Checkbox"
                                label={translate({
                                  text: "I am a Landlord",
                                })}
                                name="isOwner"
                                onChange={(e) => {
                                  handleCheck(e);
                                  handleChange(e);
                                }}
                              />
                            </Form.Group>
                          </Form.Row>
                          {isOwner && (
                            <div>
                              <Card.Title tag="h6" className="mb-4">
                                <Translate text="Fill your organization details"></Translate>
                              </Card.Title>
                              <Form.Row>
                                {/* FIRST ROW */}
                                <Form.Group as={Col} md="12" controlId="organisationName">
                                  <Form.Label>
                                    <Translate text="Organization name"></Translate>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder={translate({
                                      text: "Organization name",
                                    })}
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
                                {/* SECOND ROW */}
                                <Form.Group as={Col} md="2" controlId="orgCivicNumber">
                                  <Form.Label>
                                    <Translate text="Civic #"></Translate>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder={translate({
                                      text: "Civic #",
                                    })}
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
                                    <Translate text="Street name"></Translate>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder={translate({
                                      text: "Street name",
                                    })}
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
                                    <Translate text="Apart."></Translate>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder={translate({
                                      text: "Apart.",
                                    })}
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
                                {/* THIRD ROW */}
                                <Form.Group as={Col} md="6" controlId="orgCity">
                                  <Form.Label>
                                    <Translate text="City"></Translate>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder={translate({
                                      text: "City",
                                    })}
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
                                    <Translate text="Province"></Translate>
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
                                    <Translate text="Postal Code"></Translate>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder={translate({
                                      text: "Postal Code",
                                    })}
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
                            </div>
                          )}

                          {/* <Form.Group>
                      <Form.Check
                        required
                        name="terms"
                        label="Agree to terms and conditions"
                        onChange={handleChange}
                        isInvalid={!!errors.terms}
                        feedback={errors.terms}
                      />
                    </Form.Group> */}
                          <Button type="submit">
                            <Translate text="Finish"></Translate>
                          </Button>
                          {error && (
                            <span>
                              <Translate text="An error has occured."></Translate>
                            </span>
                          )}
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      )}
    </Translator>
  );
}
