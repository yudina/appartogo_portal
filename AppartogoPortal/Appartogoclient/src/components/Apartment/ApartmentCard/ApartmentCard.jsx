import React, { useContext } from 'react';
import './ApartmentCard.css'
import Card from 'react-bootstrap/Card';
import { FaRegCalendarAlt, FaRulerCombined } from 'react-icons/fa';
import appart from './apparts-images/appart.jpg';
import MyVerticallyCenteredModal from '../../Form/ModalContainer/MyVerticallyCenteredModal';
import ApartmentForm from '../../Form/ApartmentForm';
import AdForm from '../../Form/AdForm';
import ApartmentCardIcons from '../ApartmentCardIcons/ApartmentCardIcons';
import ApartmentsContext from '../../../context/ApartmentsContext';
import { Button } from 'react-bootstrap';
import ListingService from '../../../services/ListingsService';
import ApartmentService from '../../../services/AppartementsService';
import { Translate } from "react-translated";
import PropertiesContext from '../../../context/PropertiesContext';


function ApartmentCard({ apartment }) {
  const apartmentsContext = useContext(ApartmentsContext);
  const propertiesContext = useContext(PropertiesContext);

  const [modalShowApart, setModalShowApart] = React.useState(false);
  const [modalShowAd, setModalShowAd] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);

  const deleteApartmentConfirm = () => {
    setModalDelete(true);
  }

  const deleteApartment = async () => {
    try {
      let { data: listings } = await ListingService.fetchListings([apartment]);
      if (listings.length > 0) {
        listings.forEach(async (listing) => {
          if (!listing.archived)
            listing.archived = true;
          let res = await ListingService.modifyListing(listing);
        })
      }
      apartment.archived = true;
      let resDelete = await ApartmentService.modifyAppartment(apartment);
      setModalDelete(false);
      await apartmentsContext.fetchApartments();
    } catch (error) {
      console.log(error)
    }
  }

  const closeModalApart = () => {
    setModalShowApart(false);
  }

  const closeModalAd = () => {
    setModalShowAd(false);
  }

  return (
    <div className="apart-card-container" >
      <Card className="apart-card-item-active">
        <Card.Img
          className="apart-card-img"
          variant="top"
          src={appart}
        />
        <Card.Body className="apart-card-body-style">
          <Card.Header className="apart-card-header-style">
            <Card.Title
              className="apart-card-title-style">
              {apartment.apartmentType + '  # ' + apartment.apartmentNumber}
            </Card.Title>
            <div className="apart-card-header-right">
              <FaRulerCombined className="FaRulerCombined"></FaRulerCombined>
              <div className="apart-card-header-right-size">
                {apartment.size}
              </div>

            </div>

          </Card.Header>

          <Card.ImgOverlay className="apart-card-overlay-style">
            <div className="apart-card-image-overlay">
              <div className="apart-card-image-overlay-updated-time">
                <FaRegCalendarAlt />
                <span>{apartment.availibityDate.slice(0, apartment.availibityDate.indexOf('T'))}</span>
              </div>
            </div>
          </Card.ImgOverlay>

          <ApartmentCardIcons apartment={apartment} />

          <div className="apart-card-button-container">
            <Button variant="primary" onClick={() => setModalShowAd(true)}>
              <Translate text="Publish" />
            </Button>

            <MyVerticallyCenteredModal
              show={modalShowAd}
              onHide={() => setModalShowAd(false)}>
              <AdForm
                closeModal={closeModalAd}
                properties={apartmentsContext.properties}
                apartments={apartmentsContext.apartments}
                apartment={apartment}
                language={propertiesContext.language}
              />
            </MyVerticallyCenteredModal>

            <MyVerticallyCenteredModal
              show={modalDelete}
              onHide={() => setModalDelete(false)}>
              <span><Translate text="Are you sure you want to delete this apartment?" /></span>
              <div className="delete-modal">
                <Button onClick={deleteApartment}><Translate text="Delete" /></Button>
                <Button onClick={() => setModalDelete(false)}><Translate text="Cancel" /></Button>
              </div>
            </MyVerticallyCenteredModal>

            <Button className="apart-card-button" variant="primary" onClick={() => setModalShowApart(true)}>
              <Translate text="Edit" />
            </Button>

            <MyVerticallyCenteredModal
              show={modalShowApart}
              onHide={() => setModalShowApart(false)}>
              <ApartmentForm
                closeModal={closeModalApart}
                editData={apartment}
                properties={apartmentsContext.properties}
              />
            </MyVerticallyCenteredModal>

            <Button className="apart-card-button" onClick={deleteApartmentConfirm} variant="outline-dark"><Translate text="Delete" /></Button>
          </div>

        </Card.Body>
      </Card>

    </div>
  );

}

export default ApartmentCard;