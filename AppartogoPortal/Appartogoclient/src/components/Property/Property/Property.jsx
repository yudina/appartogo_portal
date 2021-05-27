import React, { useContext } from "react";
import './Property.css';
import { UncontrolledCollapse, Card, CardBody } from 'reactstrap';
import { FaAngleDown } from 'react-icons/fa';
import ApartmentsContainer from "../../Apartment/ApartmentsContainer";
import PropertyForm from '../../Form/PropertyForm';
import MyVerticallyCenteredModal from '../../Form/ModalContainer/MyVerticallyCenteredModal';
import Button from 'react-bootstrap/Button';
import PropertiesContext from '../../../context/PropertiesContext';
import PropertyService from '../../../services/PropertyService';
import { Translate } from "react-translated";
import { BiWindows } from "react-icons/bi";

function Property({ property, language }) {

  const propertiesContext = useContext(PropertiesContext);

  const [modalShow, setModalShow] = React.useState(false);
  const [modalNoDelete, setModalNoDelete] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);
  const [apartmentsCount, setApartmentsCount] = React.useState(0);

  const deletePropertyConfirm = () => {
    if (apartmentsCount > 0) {
      setModalNoDelete(true);
    } else {
      setModalDelete(true);
    }

  }

  const deleteProperty = async () => {
    try {
      let result = await PropertyService.deleteProperty(property);
      setModalDelete(false);
      //window.location.reload();
      await propertiesContext.fetchProperties();
      
    } catch (error) {
      console.log(error);
    }
  }

  const closeModal = () => {
    setModalShow(false);
  }

  return (
    <React.Fragment>
      <tbody>
        <tr>
          {console.log('language props', language)}
          <td className="align-middle text-nowrap">
            {`${" "
              + property.address.civicNumber + " "
              + property.address.streetName + " - "
              + property.address.city + " "
              + property.address.country + " "
              + property.address.state + " "
              + 'Number of apartment: ' + apartmentsCount
              }`}

            <Button variant="primary" onClick={() => setModalShow(true)}>
              <Translate text="Edit" />
            </Button>
            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}>
              <PropertyForm closeModal={closeModal} editData={property} />
            </MyVerticallyCenteredModal>

            <MyVerticallyCenteredModal
              show={modalNoDelete}
              onHide={() => setModalNoDelete(false)}>
              <span><Translate text="You cannot delete a property with one or more apartments" /></span>
            </MyVerticallyCenteredModal>

            <MyVerticallyCenteredModal
              show={modalDelete}
              onHide={() => setModalDelete(false)}>
              <span><Translate text="Are you sure you want to delete this property?" /></span>
              <div className="delete-modal">
                <Button onClick={deleteProperty}><Translate text="Delete" /></Button>
                <Button onClick={() => setModalDelete(false)}><Translate text="Cancel" /></Button>
              </div>
            </MyVerticallyCenteredModal>

            <Button className="card-button" onClick={deletePropertyConfirm} variant="outline-dark"><Translate text="Delete" /></Button>
          </td>
          <td className="align-middle text-right">
            <a href="#" id={"tr-" + property.id}>
              <FaAngleDown></FaAngleDown>
            </a>
          </td>
        </tr>

        <tr><td>
          <UncontrolledCollapse toggler={"tr-" + property.id}>
            <Card>
              <CardBody>
                <ApartmentsContainer
                  property={property}
                  setApartmentsCount={setApartmentsCount}
                />
              </CardBody>
            </Card>
          </UncontrolledCollapse>
        </td></tr>
      </tbody>
    </React.Fragment>
  );

}

export default Property;