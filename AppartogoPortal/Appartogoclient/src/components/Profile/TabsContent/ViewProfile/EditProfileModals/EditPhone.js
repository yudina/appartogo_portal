import React, { useState } from "react";
import { Formik } from "formik";
import { Modal, Row, Card, Form, Button, Col } from "react-bootstrap";
import Axios from "axios";
import { phoneSchema, phoneSchemaFr } from "../../../constants/AccountSchema";
import { Translate } from "react-translated";

export default function EditPhone(props) {
  const [error, setError] = useState(false);

  const handleSubmit = async (evt) => {
    const isValid = await phoneSchema.validate(evt);
    if (!isValid) {
      return;
    } else {
      /* EDIT EXISTING USER IN DB */
      if (props.auth.getAccountId()) {
        const userBody = {
          id: props.auth.getAccountId(),
          firstName: props.userAccount.firstName,
          lastName: props.userAccount.lastName,
          addressId: props.userAccount.addressId,
          email: props.userAccount.email,
          phoneNumber: evt.phone,
        };

        const userAccountResponse = await Axios.put("/Account", userBody).catch(function (error) {
          console.log(error);
        });

        if (userAccountResponse && userAccountResponse.status === 200) {
          props.closeModal();
          window.location.reload();
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          <Translate text="Edit Phone Number" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-5 justify-content-md-center">
          <Col lg={12}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title tag="h6" className="mb-4">
                  <Translate text="Edit your phone" />
                </Card.Title>
                <Formik
                  validationSchema={() => {
                    return props.language === "en" ? phoneSchema : phoneSchemaFr;
                  }}
                  onSubmit={handleSubmit}
                  initialValues={{
                    phone: "",
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
                        <Form.Group as={Col} md="12" controlId="phone">
                          <Form.Label>
                            <Translate text="Phone number" />
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

                      <Button className="d-block mr-0 ml-auto" type="submit">
                        <Translate text="Save" />
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
