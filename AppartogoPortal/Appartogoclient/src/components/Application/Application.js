import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Col, Container, Row, Card, Form, Button } from "react-bootstrap";
import "./Application.css";
import { schema, schemaFr } from "./ApplicationSchema";
import Axios from "axios";
import { Loader } from "../Loader/Loader";
import { Thumb } from "./Thumb";
import { Translate, Translator } from "react-translated";

export default function Application(props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const [userAddress, setUserAddress] = useState({
    civic: "",
    street: "",
    apart: "",
    city: "",
    province: "",
    postalcode: "",
  });

  const handleSubmit = async (evt) => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    } else {
      setLoading(true);
      if (props.auth.getAccountId() && props.listingId !== "") {
        const applicationBody = {
          accountId: props.auth.getAccountId(),
          listingId: props.listingId,
          consentForCreditCheck: evt.consentCreditCheck,
          wantsRentalInsurance: evt.consentInsurance,
        };

        // Add new Application to DB
        const applicationResponse = await Axios.post("/Application", applicationBody).catch(
          function (error) {
            console.log(error);
          }
        );

        if (applicationResponse && applicationResponse.status === 200 && applicationResponse.data) {
          // all good now create new conversation
          const conversationBody = {
            listingId: props.listingId,
            createdById: props.auth.getAccountId(),
            otherParticipantId: props.ownerAccountId,
          };

          // Add new conversation to DB
          const conversationResponse = await Axios.post("/Conversation", conversationBody).catch(
            function (error) {
              console.log(error);
            }
          );

          if (
            conversationResponse &&
            conversationResponse.status === 200 &&
            conversationResponse.data
          ) {
            // all good now send new message
            const messageBody = {
              conversationId: conversationResponse.data,
              senderId: props.auth.getAccountId(),
              receiverId: props.ownerAccountId,
              text: evt.message,
              WasReceived: true,
            };

            // Add new Message to the conversation
            const messageResponse = await Axios.post("/Message", messageBody).catch(function (e) {
              console.log(e);
            });

            if (messageResponse && messageResponse.status === 200 && messageResponse.data) {
              // all good now send attachment if file exist

              if (evt.file && evt.file.name.length !== 0) {
                const formData = new FormData();
                // formData.append("messageId", messageResponse.data);
                formData.append("applicationId", applicationResponse.data);
                // formData.append("listingId", props.listingId);
                formData.append("name", evt.file.name.split(".")[0]);
                formData.append("type", "." + evt.file.name.split(".").pop());
                formData.append("AttachmentFile", evt.file);

                const attachmentResponse = await Axios.post("/Attachment", formData).catch(
                  function (e) {
                    console.log(e);
                  }
                );

                if (
                  attachmentResponse &&
                  attachmentResponse.status === 200 &&
                  attachmentResponse.data
                ) {
                  props.auth.history.push("/applications-history");
                } else {
                  setLoading(false);
                  setError(true);
                }
              } else {
                props.auth.history.push("/applications-history");
              }
            } else {
              setLoading(false);
              setError(true);
            }
          } else {
            setLoading(false);
            setError(true);
          }
        } else {
          setLoading(false);
          setError(true);
        }
      } else {
        setError(true);
        setLoading(false);
      }
    }
  };

  const fetchProfileData = async () => {
    if (props.auth.getAccountId()) {
      // fetch user profile
      const firstResponse = await Axios.get(`/Account/${props.auth.getAccountId()}`).catch(
        function (error) {
          console.log(error);
        }
      );

      if (firstResponse && firstResponse.data) {
        setUserDetails({
          firstname: firstResponse.data.firstName,
          lastname: firstResponse.data.lastName,
          email: firstResponse.data.email,
          phone: firstResponse.data.phoneNumber,
        });

        // GET ADDRESS
        const urlToGetAddress = `/Address/${firstResponse.data.addressId}`;
        const secondResponse = await Axios.get(urlToGetAddress).catch(function (error) {
          console.log(error);
        });

        setLoading(false);

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
          setError(true);
        }
      } else {
        setError(true);
        setLoading(false);
      }
    } else {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      await fetchProfileData();
    };
    getProfile();
  }, []);

  return (
    <Container className="mb-5">
      <Row className="mb-2">
        <Col lg={12}>
          <div className="mt-3 mb-3">
            {" "}
            <Translate text="Your are applying for this listing: "></Translate>
            {props.listingTitle}{" "}
          </div>
        </Col>
      </Row>
      {loading && <Loader />}
      <Row></Row>
      <Row className="mb-5 justify-content-md-center">
        <Col lg={12}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title tag="h6" className="mb-4">
                <Translate text="Submit application"></Translate>
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
                  message: "",
                  consentCreditCheck: false,
                  consentInsurance: false,
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  setFieldValue,
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
                          name="firstName"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userDetails.firstname}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="4" controlId="lastName">
                        <Form.Label>
                          <Translate text="Last Name"></Translate>
                        </Form.Label>
                        <Form.Control
                          name="lastName"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userDetails.lastname}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="4" controlId="phone">
                        <Form.Label>
                          <Translate text="Phone number"></Translate>
                        </Form.Label>
                        <Form.Control
                          name="phone"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userDetails.phone}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      {/* SECOND ROW */}
                      <Form.Group as={Col} md="2" controlId="civicNumber">
                        <Form.Label>
                          <Translate text="Civic #"></Translate>
                        </Form.Label>
                        <Form.Control
                          name="civicNumber"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userAddress.civic}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="8" controlId="street">
                        <Form.Label>
                          <Translate text="Street name"></Translate>
                        </Form.Label>
                        <Form.Control
                          name="street"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userAddress.street}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="apart">
                        <Form.Label>
                          <Translate text="Apart."></Translate>
                        </Form.Label>
                        <Form.Control
                          name="apart"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userAddress.apart}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      {/* THIRD ROW */}
                      <Form.Group as={Col} md="6" controlId="city">
                        <Form.Label>
                          <Translate text="City"></Translate>
                        </Form.Label>
                        <Form.Control
                          name="city"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userAddress.city}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="3" controlId="province">
                        <Form.Label>
                          <Translate text="Province"></Translate>
                        </Form.Label>
                        <Form.Control
                          name="province"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userAddress.province}
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group as={Col} md="3" controlId="postalCode">
                        <Form.Label>
                          <Translate text="Postal Code"></Translate>
                        </Form.Label>
                        <Form.Control
                          name="postalCode"
                          className="text-muted border pl-2"
                          plaintext
                          readOnly
                          value={userAddress.postalcode}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Translator>
                      {({ translate }) => (
                        <Form.Row>
                          <Form.Group>
                            <Form.Check
                              required
                              name="consentCreditCheck"
                              label={translate({
                                text: "Accept credit check (optional)",
                              })}
                              onChange={handleChange}
                              isInvalid={!!errors.consentCreditCheck}
                              feedback={errors.consentCreditCheck}
                            />
                          </Form.Group>
                        </Form.Row>
                      )}
                    </Translator>
                    <Translator>
                      {({ translate }) => (
                        <Form.Row>
                          <Form.Group>
                            <Form.Check
                              required
                              name="consentInsurance"
                              label={translate({
                                text: "Accept insurance fees (optional)",
                              })}
                              onChange={handleChange}
                              isInvalid={!!errors.consentInsurance}
                              feedback={errors.consentInsurance}
                            />
                          </Form.Group>
                        </Form.Row>
                      )}
                    </Translator>

                    <Form.Row className="mt-4">
                      <Form.Group as={Col} md="12" controlId="message">
                        <Form.Label>
                          <Translate text="Your message to the owner"></Translate>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="message"
                          value={values.message}
                          onChange={handleChange}
                          isInvalid={touched.message && errors.message}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>

                    <h5 className="mt-4 mb-4">
                      <Translate text="Attach a document "></Translate>
                      <small>
                        <Translate text="(.pdf document or image) "></Translate>
                        <Translate text="(optional)"></Translate>
                        <br />
                        <small>
                          <Translate text="You will be able to add more documents later."></Translate>
                        </small>
                      </small>
                    </h5>
                    <Form.Group as={Col} md="3">
                      <label style={{ width: "inherit" }} className="cursor" for="file">
                        <span className="border p-2">
                          <Translate text="File upload"></Translate>
                        </span>
                      </label>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                        }}
                        className="form-control"
                      />
                      <Thumb file={values.file} />
                      {values.file && (
                        <button
                          type="reset"
                          className="mt-2"
                          onClick={() => setFieldValue("file", "")}
                        >
                          <Translate text="Remove file"></Translate>
                        </button>
                      )}
                    </Form.Group>

                    <Button type="submit" className="pull-right mt-4">
                      <Translate text="Submit"></Translate>
                    </Button>
                    {error && (
                      <span className="pull-right m-2">
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
    </Container>
  );
}
