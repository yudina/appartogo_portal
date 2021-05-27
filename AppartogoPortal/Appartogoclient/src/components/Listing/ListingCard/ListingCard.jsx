import React from 'react';
import './ListingCard.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CardIcons from '../CardIcons/CardIcons';
import { BiTime } from 'react-icons/bi'
import { FaRegCalendarAlt } from 'react-icons/fa';
import MyVerticallyCenteredModal from '../../Form/ModalContainer/MyVerticallyCenteredModal';
import AdForm from '../../Form/AdForm';
import ListingsContext from '../../../context/ListingsContext';
import 'react-bnb-gallery/dist/style.css'
import { Loader } from '../../Loader/Loader';
import { Translate } from "react-translated";

class ListingCard extends React.Component {

  _isMounted = false;

  constructor() {
    super(...arguments);
    this.state = {
      properties: [],
      apartments: [],
      modalShow: false,
      image: null,
      galleryOpened: false,
      photos: [],
      isLoading: true
    }
  }

  

  static contextType = ListingsContext;

  componentDidMount() {
    this.setState({ isLoading: true })    
    this.loadImage();
    this.setState({ isLoading: false })    
  }

  loadImage = () => {
    const { listing } = this.props;
    let re = new RegExp("^\\.[\\w]+$");
    if (listing.attachments.length > 0 && re.test(listing.attachments[0].type)) {
      import(`../../../assets/listingPictures/${listing.attachments[0].id}${listing.attachments[0].type}`).then(image => {
        this.setState({
          image: image.default
        });
      }).catch(err => {
        console.log(err)
        import(`../../../assets/listingPictures/no-image.png`).then(image => {
          this.setState({
            image: image.default
          });
        }).catch(err => console.log(err))
      });
    } else {
      import(`../../../assets/listingPictures/no-image.png`).then(image => {
        this.setState({
          image: image.default
        });
      })
    }
  };

  setModalShow = (bool) => {
    this.setState({ modalShow: bool });
  }

  closeModal = async () => {
    this.setState({ modalShow: false });
  }

  publish = () => {
    const { changeAppartState, listing } = this.props;
    changeAppartState && changeAppartState(listing.id, false);
  }

  archive = () => {
    const { changeAppartState, listing } = this.props;
    changeAppartState && changeAppartState(listing.id, true);
  }

  render() {
    const { listing, isArchivedCard } = this.props;
    const { modalShow, image, isLoading } = this.state;

    return (
      <ListingsContext.Consumer>
        {(context) =>
          (<div className="card-container" >
            {!isLoading ? 
            <Card
            className={
              isArchivedCard
                ? "card-item-archived"
                : "card-item-active"
            }>
            <Card.Img
              className="card-img"
              variant="top"
              src={image}
            />
            <Card.Body className="card-body-style">
              <Card.Header className="card-header-style">
                <Card.Title
                  className="card-title-style">
                  ${listing.rent}
                </Card.Title>
                <div className="card-header-right">
                  <div className="card-header-right-size">
                    {listing.apartment.size}
                  </div>
                  <CardIcons listing={listing} />
                </div>
              </Card.Header>

              <Card.ImgOverlay className="card-overlay-style">
                <div className="card-image-overlay">
                  <div className="card-image-overlay-updated-time">
                    <BiTime />
                    <span>{listing.postedDateTime.slice(0, listing.postedDateTime.indexOf('T'))}</span>
                  </div>
                  <div className="card-image-overlay-availability">
                    <FaRegCalendarAlt />
                    <span>{listing.apartment.availibityDate.slice(0, listing.apartment.availibityDate.indexOf('T'))}</span>
                  </div>
                </div>
              </Card.ImgOverlay>

              <Card.Text >
                <div className="card-text-style-title">
                {listing.titre.substring(0, 30)}
                </div>
                <div className="card-text-style">
                 {listing.description.substring(0, 50)}
                </div>
                
              </Card.Text>
              <div className="card-button-container">
                {
                  isArchivedCard != null && (
                    isArchivedCard ?
                      <Button
                        className="card-button"
                        onClick={this.publish}
                        variant="outline-dark"
                      >
                        <Translate text="Publish" />
                  </Button>
                      :
                      <Button
                        className="card-button"
                        onClick={this.archive}
                        variant="outline-dark"
                      >
                        <Translate text="Archive" />
                  </Button>
                  )}
                <Button variant="primary" onClick={() => this.setModalShow(true)}>
                <Translate text="Edit" />
                </Button>

                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => this.setModalShow(false)}>

                  <AdForm
                    editData={listing}
                    apartments={context.apartments}
                    properties={context.properties}
                    closeModal={this.closeModal}
                  />
                </MyVerticallyCenteredModal>
              </div>
            </Card.Body>
          </Card>
              : 
              (<Loader size="medium" />)
            }
            
          </div>
          )}
      </ListingsContext.Consumer>
    );
  };
}

export default ListingCard;