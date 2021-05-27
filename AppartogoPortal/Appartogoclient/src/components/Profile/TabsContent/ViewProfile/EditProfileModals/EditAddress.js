import React, { useState } from "react";
import { Formik } from "formik";
import { Modal, Container, Row, Card, Form, Button, Col } from "react-bootstrap";
import Axios from "axios";
import { addressSchema, addressSchemaFr } from "../../../constants/AccountSchema";
import { Translate } from "react-translated";

export default function EditAddress(props) {
  const [error, setError] = useState(false);

  const handleSubmit = async (evt) => {
    const isValid = await addressSchema.validate(evt);
    if (!isValid) {
      return;
    } else {
      /* EDIT EXISTING USER ADDRESS IN DB */
      const addressBody = {
        Id: props.userAccount.addressId,
        CivicNumber: evt.civicNumber,
        StreetName: evt.street,
        City: evt.city,
        PostalCode: evt.postalCode,
        Country: "Canada",
        State: evt.province,
        ApartmentNumber: evt.apart ? evt.apart : "",
      };

      const addressResponse = await Axios.put("/Address", addressBody).catch(function (error) {
        console.log(error);
      });

      if (addressResponse && addressResponse.status === 200) {
        props.closeModal();
        window.location.reload();
      } else {
        setError(true);
      }
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          <Translate text="Edit Address" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-5 justify-content-md-center">
          <Col lg={12}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title tag="h6" className="mb-4">
                  <Translate text="Fill your address details" />
                </Card.Title>
                <Formik
                  validationSchema={() => {
                    return props.language === "en" ? addressSchema : addressSchemaFr;
                  }}
                  onSubmit={handleSubmit}
                  initialValues={{
                    civicNumber: "",
                    street: "",
                    apart: "",
                    city: "",
                    province: "",
                    postalCode: "",
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
                        <Form.Group as={Col} md="2" controlId="civicNumber">
                          <Form.Label>
                            <Translate text="Civic #" />
                          </Form.Label>
                          <Form.Control
                            type="text"
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
                            <Translate text="Street name" />
                          </Form.Label>
                          <Form.Control
                            type="text"
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
                            <Translate text="Apart." />
                          </Form.Label>
                          <Form.Control
                            type="text"
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
                        <Form.Group as={Col} md="6" controlId="city">
                          <Form.Label>
                            <Translate text="City" />
                          </Form.Label>
                          <Form.Control
                            type="text"
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
                            <Translate text="Province" />
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
                            <Translate text="Postal Code" />
                          </Form.Label>
                          <Form.Control
                            type="text"
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
