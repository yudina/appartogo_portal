import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../FormInput/FormInput.css';

function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>

          {props.children}

        </Modal.Body>
      </Modal>
    );
  }
  
  function ModalContainer({ children, buttonText, label}) {
    const [modalShow, setModalShow] = React.useState(false);
  
    return (
      <>
        {label ? 
        <Button className="listActions-actions" variant="outline-dark" onClick={() => setModalShow(true)}>
        {buttonText}
      </Button>
        :
        <Button variant="primary" onClick={() => setModalShow(true)}>
          {buttonText}
        </Button>
        }

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}>
            {children}
        </MyVerticallyCenteredModal>
      </>
    );
  }

  export default ModalContainer;