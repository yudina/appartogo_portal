import React from 'react';
import './ListingsContainer.css'
import ListingCard from '../ListingCard';
import AltListIcons from '../AltListIcons';
import ApartmentListItem from '../ApartmentListItem'
import MyVerticallyCenteredModal from '../../Form/ModalContainer/MyVerticallyCenteredModal';
import AdForm from '../../Form/AdForm';
import Table from 'react-bootstrap/Table';
import ListingsContext from '../../../context/ListingsContext';
import { ReactComponent as NoListings } from "../../../assets/noListings.svg";
import { Loader } from '../../Loader/Loader';
import { Button } from 'react-bootstrap';
import AttachmentService from '../../../services/AttachmentsService';
import ApartmentService from '../../../services/AppartementsService';
import ListingService from '../../../services/ListingsService';
import PropertyService from '../../../services/PropertyService';
import OrganizationService from '../../../services/OrganizationService';
import AddressService from '../../../services/AddressService';
import { Translate } from "react-translated";


class ListingsContainer extends React.Component {

  state = {
    listings: [],
    active: [],
    archived: [],
    isActiveGrid: true,
    isArchivedGrid: true,
    properties: [],
    apartments: [],
    isLoading: false,
    modalShow: false,
    organizationId: null
  }

  changeAppartState = async (id, archiving) => {
    try {
      let listing = this.state.listings.find(listing => listing.id === id);
      if (listing) {
        listing.archived = archiving;
        const copy = { ...listing };
        delete copy.apartment;
        delete copy.attachments;
        const result = await ListingService.modifyListing(copy);
      }
      await this.fetchListings();
    } catch (error) {
      console.log(error)
    }

  }

  triggerGridActive = () => {
    this.setState({ isActiveGrid: true });
  }

  triggerListActive = () => {
    this.setState({ isActiveGrid: false });
  }

  triggerGridArchived = () => {
    this.setState({ isArchivedGrid: true });
  }

  triggerListArchived = () => {
    this.setState({ isArchivedGrid: false });
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    try {
      if (this.props.auth.getAccountId()) {
        const { data: organizationId } = await OrganizationService.fetchOrganisation(this.props.auth.getAccountId());
        this.setState({ organizationId: organizationId[0].organizationId });
        let { data: properties } = await PropertyService.fetchPropertiesByOrg(this.state.organizationId);
        if (properties.length > 0) {
          let propertiesToReturn = await Promise.all([...properties.map(async (property) => {
            if (!property.archived) {
              const { data: address } = await AddressService.fetchAddress(property.addressId);
              if (address) {
                let newProperty = { ...property, address: address };
                return newProperty;
              }
            }
          })]);
          propertiesToReturn = propertiesToReturn.filter(property => property);
          let apartments = [];
          if (propertiesToReturn && propertiesToReturn.length > 0) {
            let { data: allApartments } = await ApartmentService.fetchAppartments(propertiesToReturn);
            if (allApartments.length > 0) {
              apartments = [...allApartments];
              await this.setState({ properties: propertiesToReturn, apartments: allApartments });
            }
          }
          await this.fetchListings(propertiesToReturn, apartments, true);
        }
      }
    } catch (error) {
      console.log(error);
    }

  }

  fetchListings = async (propertiesParam, apartmentsParam) => {

    const { organizationId } = this.state;
    let properties = [];
    let apartments = [];
    await this.setState({ isLoading: true })
    try {
      if (organizationId) {
        let mylistings = [];
        if (propertiesParam) {
          properties = [...propertiesParam];
        } else {
          let { data: allProperties } = await PropertyService.fetchPropertiesByOrg(organizationId);
          properties = [...allProperties];
        }
        if (properties.length > 0) {
          if (apartmentsParam) {
            apartments = [...apartmentsParam];
          } else {
            let { data: allApartments } = await ApartmentService.fetchAppartments(properties);
            apartments = [...allApartments];
          }
          if (apartments.length > 0) {
            let { data: allListings } = await ListingService.fetchListings(apartments);
            if (allListings.length > 0) {
              let { data: allAttachments } = await AttachmentService.fetchAttachments(allListings);
              mylistings = await Promise.all([...allListings.map(listing => {
                let apartment = apartments.find(apartment => apartment.id === listing.apartmentId);
                let attachmentsListing = allAttachments.filter(attachment => attachment != undefined && attachment.listingId === listing.id);
                let attachments = attachmentsListing.length > 0 ? attachmentsListing : []
                return { ...listing, apartment: apartment, attachments: attachments };
              })]);
            }
          }
        }

        const getActive = mylistings.filter((listing) => !listing.archived);
        const getArchived = mylistings.filter((listing) => listing.archived);
        this.setState({ listings: mylistings, active: getActive, archived: getArchived });

      }
    } catch (error) {
      console.log(error)
    }
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 1300);
  }

  setModalShow = (bool) => {
    this.setState({ modalShow: bool });
  }

  closeModal = () => {
    this.setState({ modalShow: false });
  }

  render() {

    const { isArchivedGrid, isActiveGrid, properties, apartments, isLoading, modalShow } = this.state

    return (
      <div className="listings-container mainContent">
        <ListingsContext.Provider value={{
          fetchListings: this.fetchListings,
          apartments: apartments,
          properties: properties,
          language: this.props.language
        }}>

          {apartments.length > 0 ?
            <div>
              <div className="listings-title-container">
                <h2 className="listings-title"><Translate text="My Listings" /></h2>
              </div>

              <Button variant="primary" onClick={() => this.setModalShow(true)}>
                <Translate text="Add listing" />
              </Button>

              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => this.setModalShow(false)}>
                <AdForm closeModal={this.closeModal} properties={properties} apartments={apartments} />
              </MyVerticallyCenteredModal>

              {!isLoading ?
                (
                  <div>
                    <div >
                      {this.state.active && this.state.active.length > 0 ?
                        (
                          <div>
                            <div className="listings-title-active-container">
                              <h3 className="listings-title-active"><Translate text="Active listings" /></h3>
                              <AltListIcons
                                isGrid={isActiveGrid}
                                triggerList={this.triggerListActive}
                                triggerGrid={this.triggerGridActive}
                              />
                            </div>
                            <div className="listings-active">
                              {
                                this.state.active.map((listing, index) => isActiveGrid ?
                                  (
                                    <ListingCard
                                      key={index}
                                      listing={listing}
                                      isArchivedCard={false}
                                      changeAppartState={this.changeAppartState}
                                      language={this.props.language}
                                    />
                                  ) :
                                  (
                                    <Table responsive>
                                      <tbody>
                                        <ApartmentListItem
                                          key={listing.id}
                                          listing={listing}
                                          isArchivedCard={false}
                                          changeAppartState={this.changeAppartState}
                                        />
                                      </tbody>
                                    </Table>
                                  )
                                )
                              }
                            </div>
                          </div>
                        ) :
                        null
                      }
                    </div>





                    <div >
                      {this.state.archived.length > 0 ?
                        (
                          <div>
                            <div className="listings-title-archived-container">
                              <h3 className="listings-title-archived"><Translate text="Archived listings" /></h3>
                              <AltListIcons
                                isGrid={isArchivedGrid}
                                triggerList={this.triggerListArchived}
                                triggerGrid={this.triggerGridArchived}
                              />
                            </div>
                            <div className="listings-archived">
                              {
                                this.state.archived.map((listing) => isArchivedGrid ?
                                  (
                                    <ListingCard
                                      key={listing.id}
                                      listing={listing}
                                      isArchivedCard={true}
                                      changeAppartState={this.changeAppartState}
                                      language={this.props.language}
                                    />) :
                                  (<Table responsive>
                                    <tbody>
                                      <ApartmentListItem
                                        key={listing.id}
                                        listing={listing}
                                        isArchivedCard={true}
                                        changeAppartState={this.changeAppartState}
                                      />
                                    </tbody>
                                  </Table>
                                  )
                                )
                              }
                            </div>
                          </div>

                        ) :
                        null
                      }
                    </div>
                  </div>
                )
                :
                (<Loader size="medium" />)
              }
            </div>
            :
            <div>
              <div className="noProperties">
                <NoListings height="500" width="500" />
              </div>
              <div className="np-text">
                <Translate text="Once you have an Apartment, you'll be able to create a listing" />
              </div>
            </div>
          }

        </ListingsContext.Provider>
      </div>
    )
  }

}

export default ListingsContainer;