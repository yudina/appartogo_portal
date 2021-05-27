import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Translate } from "react-translated";
import DocumentsModal from "./DocumentsModal";

export default function Documents(props) {
  const [showViewAddDocument, setShowViewAddDocument] = useState(false);
  const handleCloseViewAddDocument = () => setShowViewAddDocument(false);
  const handleShowViewAddDocument = () => setShowViewAddDocument(true);

  return (
    <>
      <Link
        size="sm"
        style={{ display: "inline-block" }}
        className="text-danger"
        onClick={handleShowViewAddDocument}
      >
        <Translate text="View or Add documents"></Translate>
      </Link>
      <Modal
        size="xl"
        show={showViewAddDocument}
        onHide={handleCloseViewAddDocument}
        backdrop="static"
        keyboard={false}
      >
        <DocumentsModal
          {...props}
          applicationId={props.applicationId}
          closeModal={handleCloseViewAddDocument}
        />
      </Modal>
    </>
  );
}
