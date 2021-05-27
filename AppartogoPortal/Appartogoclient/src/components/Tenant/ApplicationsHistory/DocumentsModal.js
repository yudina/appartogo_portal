import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Modal, Row, Card, Form, Button, Col } from "react-bootstrap";
import Axios from "axios";
import { Thumb } from "../../Application/Thumb";
import axios from "axios";
import { Loader } from "../../Loader/Loader";
import { Translate } from "react-translated";

export default function DocumentsModal(props) {
  const [error, setError] = useState(false);
  const [noDocuments, setNoDocuments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [arrayOfDocuments, setArrayOfDocuments] = useState([]);

  const fetchDocumentList = async () => {
    if (props.applicationId) {
      // fetch attachments for this application
      const firstResponse = await Axios.get(
        `/Attachment/byapplicationid/${props.applicationId}`
      ).catch(function (error) {
        console.log(error);
      });

      if (firstResponse && firstResponse.status === 200) {
        if (firstResponse.data && firstResponse.data.length > 0) {
          firstResponse.data.map((url) => {
            if (url) {
              try {
                import(`../../../assets/Attachments/${url.pathFile.split("\\").pop()}`)
                  .then((document) => {
                    setArrayOfDocuments((oldarray) => [
                      ...oldarray,
                      { file: document.default, name: url.name, type: url.type },
                    ]);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } catch {
                setLoading(false);
                setNoDocuments(true);
              }
            }
          });
          setLoading(false);
          setNoDocuments(false);
        } else {
          setLoading(false);
          setNoDocuments(true);
        }
      } else {
        setLoading(false);
        setError(true);
      }
    } else {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    const getDocuments = async () => {
      await fetchDocumentList();
    };
    getDocuments();
  }, []);

  const handleSubmit = async (evt) => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    } else {
      if (props.applicationId) {
        if (evt.file && evt.file.name.length !== 0) {
          const formData = new FormData();
          // formData.append("messageId", messageResponse.data);
          formData.append("applicationId", props.applicationId);
          // formData.append("listingId", listingId);
          formData.append("name", evt.file.name.split(".")[0]);
          formData.append("type", "." + evt.file.name.split(".").pop());
          formData.append("AttachmentFile", evt.file);

          const attachmentResponse = await Axios.post("/Attachment", formData).catch(function (e) {
            console.log(e);
          });

          if (attachmentResponse && attachmentResponse.status === 200 && attachmentResponse.data) {
            setLoading(true);
            setSubmitted(true);
            window.location.reload();
            // props.auth.history.push("/tenant-dashboard");
          } else {
            setError(true);
          }
        } else {
          // props.auth.history.push("/tenant-dashboard");
        }
      }
    }
  };

  const schema = yup.object({
    file: yup.string().required("Required"),
  });

  const schemaFr = yup.object({
    file: yup.string().required("Requis"),
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          <Translate text="View or Add documents"></Translate>
        </Modal.Title>
      </Modal.Header>

      {loading && <Loader />}
      <Modal.Body>
        {!submitted && (
          <Row className="mb-5 justify-content-md-center">
            <Col lg={12}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title tag="h6" className="mb-4">
                    <Translate text="View documents"></Translate>
                  </Card.Title>
                  {arrayOfDocuments &&
                    arrayOfDocuments.map((document, index) => (
                      <a
                        key={index}
                        style={{ display: "inline-block" }}
                        className="border rounded p-1 mb-1 mr-1"
                        href={document.file}
                        target="_blank"
                        download
                      >
                        {`${document.name}${document.type}`}
                      </a>
                    ))}

                  {noDocuments && (
                    <small>
                      <Translate text="No documents"></Translate>
                    </small>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Body>
                  <Card.Title tag="h6" className="mb-4">
                    <Translate text="Attach a document "></Translate>
                    <small>
                      <Translate text="(.pdf document or image) "></Translate>
                    </small>
                  </Card.Title>
                  <Formik
                    validationSchema={() => {
                      return props.language === "en" ? schema : schemaFr;
                    }}
                    onSubmit={handleSubmit}
                    initialValues={{}}
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
                        <Form.Group as={Col} md="3">
                          <label className="cursor" for="file">
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
        )}
      </Modal.Body>
    </>
  );
}
