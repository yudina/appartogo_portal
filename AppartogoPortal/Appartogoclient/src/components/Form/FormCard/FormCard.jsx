import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap';

import { HeaderMain } from './HeaderMain';
import { Translate } from "react-translated";
import { Media } from 'reactstrap';

const FormCard = ({ children, title, mainTitle, no }) => {

  return (
    <React.Fragment>
      <Container>
        {mainTitle ?
          <React.Fragment>
          { /* START H1 Header */}
          <div className={` d-flex mb-5 mt-4` }>
              <h1 className="display-4 mr-3 mb-0 align-self-start">
              <Translate text={mainTitle} />
              </h1>
          </div>
          { /* END H1 Header */}
      </React.Fragment>
          
          :
          null
        }
        {title ?
          <Row>
            <Col lg={12}>
              <Media className={`mb-3`}>
                <Media left top>
                  <h4 className="mt-2">
                  <Translate text={title} />
                  </h4>
                </Media>
              </Media>
            </Col>
          </Row>
          :
          null
        }
        <Row>
          <Col lg={12}>
            <Card className="mb-3">
              <CardBody>
                {children}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default FormCard;