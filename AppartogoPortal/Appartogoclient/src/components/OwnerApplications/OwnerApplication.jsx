import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaFilePdf,
  FaImage,
  FaFileWord,
} from "react-icons/fa";
import image from "../../assets/profileImage.jpg";
import { Translate } from "react-translated";

const PDF_EXTENSTION = ".pdf";
const WORD_EXTENSION = ".word";
const FILE = "file";
const IMAGE = "image";

export default function OwnerApplication(props) {
  const statusClass = () => {
    const style = { backgroundColor: "#4d88ff" };
    if (props.item.status === 1) style.backgroundColor = "#00cc00";
    else if (props.item.status === 2) style.backgroundColor = "#ff0000";
    return style;
  };

  const getAttachmentContent = () => {
    return {
      file: (attachement) => generateDocumentAttachment(attachement),
      image: (attachement) => genereteImageAttachment(attachement),
    };
  };

  const checkDocumentType = (attachement) => {
    return attachement.type === PDF_EXTENSTION ||
      attachement.type === WORD_EXTENSION
      ? FILE
      : IMAGE;
  };

  const generateDocumentAttachment = (attachment) => {
    return attachment ? (
      <div key={attachment.id}>
        <a
          href={
            require(`../../assets/Attachments/${attachment.id}${attachment.type}`)
              .default
          }
          download
        >
          {attachment.type === PDF_EXTENSTION ? (
            <FaFilePdf className="icons-app" size={20} />
          ) : (
            <FaFileWord className="icons-app" size={20} />
          )}
          {attachment.name}
          {attachment.type}
        </a>
      </div>
    ) : null;
  };

  const genereteImageAttachment = (attachment) => {
    return attachment ? (
      <div key={attachment.id}>
        <FaImage className="icons-app" size={20} />
        <a
          href={
            require(`../../assets/Attachments/${attachment.id}${attachment.type}`)
              .default
          }
          download
        >
          {attachment.name}
          {attachment.type}
        </a>
      </div>
    ) : null;
  };

  const AttachementsContainer = () => {
    return props.item.attachements ? (
      <div>
        <h4>
          <Translate text="Files"></Translate>
        </h4>
        {props.item.attachements.map((attachement) =>
          getAttachmentContent()[checkDocumentType(attachement)](attachement)
        )}
      </div>
    ) : null;
  };

  const MessageContainer = () => {
    return (
      <div>
        <h4>Message</h4>
        <p>{props.item.message}</p>
        <div className="applicantConstent">
          {props.item.consentForCreditCheck ? (
            <p>
              <FaThumbsUp className="icons-app" size={20} />
              <Translate text="Accept credit check"></Translate>
            </p>
          ) : (
            <p>
              <FaThumbsDown className="icons-app" size={20} />
              <Translate text="Refuse credit check"></Translate>
            </p>
          )}
          {props.item.wantsRentalInsurance ? (
            <p>
              <FaThumbsUp className="icons-app" size={20} />
              <Translate text="Accept tenant insurance"></Translate>
            </p>
          ) : (
            <p>
              <FaThumbsDown className="icons-app" size={20} />
              <Translate text="Refuse tenant insurance"></Translate>
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          className="applicationModalTitle"
          id="contained-modal-title-vcenter"
        >
          <img width="100" height="100" src={image} alt="profileImage" />
          {props.item.applicant.firstName} {props.item.applicant.lastName}
          <span className="applicationStatus" style={statusClass()}></span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MessageContainer />
        <AttachementsContainer />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>
          <Translate text="Close"></Translate>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
