import React, { useContext } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import './ApartmentListItem.css'
import CardIcons from '../CardIcons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import MyVerticallyCenteredModal from '../../Form/ModalContainer/MyVerticallyCenteredModal';
import AdForm from '../../Form/AdForm';
import ListingsContext from '../../../context/ListingsContext';

function ApartmentListItem({ listing, changeAppartState, isArchivedCard }) {

  const context = useContext(ListingsContext)

  const [image, setImage] = React.useState(null);
  const [showPopOver, setShowpopOver] = React.useState(false);
  const [modalShow, setModalShow]= React.useState(false);

  React.useEffect(() => {
    loadImage()
  }, []);

  let loadImage = () => {
    let re = new RegExp("^\\.[\\w]+$");
    if (listing.attachments.length > 0 && re.test(listing.attachments[0].type)) {
      import(`../../../assets/listingPictures/${listing.attachments[0].id}${listing.attachments[0].type}`).then(image => {
        setImage(image.default)
      }).catch(err => {
        console.log(err)
        import(`../../../assets/listingPictures/no-image.png`).then(image => {
          setImage(image.default)
        }).catch(err => console.log(err))
      });
    } else {
      import(`../../../assets/listingPictures/no-image.png`).then(image => {
        setImage(image.default)
      })
    }
  }

  const publish = () => {
    changeAppartState && changeAppartState(listing.id, false);
    setShowpopOver(false)
  }

  const archive = () => {
    changeAppartState && changeAppartState(listing.id, true);
    setShowpopOver(false)
  }

  const closeModal = () => {
    setModalShow(false)
  }

  const openModal = () => {
    setModalShow(true)
    setShowpopOver(false)
  }

  const popover = (
    <Popover id="popover-basic" show={showPopOver}>
      <Popover.Content>
        <div className="listActions">
          {isArchivedCard ?
            <Button className="listActions-actions" onClick={publish} variant="outline-dark">Publish</Button>
            :
            <Button className="listActions-actions" onClick={archive} variant="outline-dark">Archive</Button>
          }
          <Button variant="primary" onClick={() => openModal()}>
                  {"Edit"}
                </Button>

                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}>

                  <AdForm
                    editData={listing}
                    apartments={context.apartments}
                    properties={context.properties}
                    closeModal={closeModal}
                  />
                </MyVerticallyCenteredModal>
        </div>
      </Popover.Content>
    </Popover>
  );

  return (
    <tr className="apartmentListItem-tr apartmentListItem-container">
      <td className="apartmentListItem-img-td"><div ></div><img alt="apartment" className="apartmentListItem-img" src={image}></img></td>
      <td className="apartmentListItem-address-td"><div className="apartmentListItem-address">{listing.description}</div></td>
      <td className="apartmentListItem-size-td"><div className="apartmentListItem-size">{listing.apartment.size}</div></td>
      <td className="apartmentListItem-icons-td"><div className="apartmentListItem-icons"><CardIcons listing={listing} /></div></td>
      <td className="apartmentListItem-pricing-td"><div className="apartmentListItem-pricing">${listing.rent}</div></td>
      <td className="apartmentListItem-lastUpdate-td"><div className="apartmentListItem-lastUpdate">{listing.apartment.availibityDate.slice(0, listing.apartment.availibityDate.indexOf('T'))}</div></td>
      <td className="apartmentListItem-actions-td">
        <OverlayTrigger trigger="click" placement="left" overlay={popover}>
          <BsThreeDotsVertical className="threeDots" />
        </OverlayTrigger>
      </td>
    </tr>
  );
}

export default ApartmentListItem;