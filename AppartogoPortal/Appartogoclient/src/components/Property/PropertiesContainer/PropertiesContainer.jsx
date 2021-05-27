import React, { Component } from 'react';
import PropertyForm from '../../Form/PropertyForm'
import Property from '../Property/Property.jsx';
import MyVerticallyCenteredModal from '../../Form/ModalContainer/MyVerticallyCenteredModal';
import { Table } from 'reactstrap';
import { ReactComponent as NoProperties } from "../../../assets/noProperties.svg";
import './PropertiesContainer.css';
import PropertiesContext from '../../../context/PropertiesContext';
import { Link } from "react-router-dom";
import { Loader } from '../../Loader/Loader';
import { Button } from 'react-bootstrap';
import OrganizationService from '../../../services/OrganizationService';
import PropertyService from '../../../services/PropertyService';
import AddressService from '../../../services/AddressService';
import { Translate } from "react-translated";

class PropertiesContainer extends Component {

  state = {
    properties: [],
    isLoading: true,
    modalShow: false,
    organizationId: null
  }

  componentDidMount = async () => {
    if (this.props.auth.getAccountId()) {
      try {
        const { data: organizationId } = await OrganizationService.fetchOrganisation(this.props.auth.getAccountId());
        this.setState({ organizationId: organizationId[0].organizationId });
        this.fetchProperties();
      } catch (error) {
        console.log(error)
      }
    }
    this.setState({ isLoading: false })
  }

  fetchProperties = async () => {
    const { organizationId } = this.state;

    this.setState({ isLoading: true })

    if (organizationId) {
      try {
        const { data: properties } = await PropertyService.fetchPropertiesByOrg(organizationId);

        if (properties.length > 0) {
          const propertiesWithAddress = await properties.map(async (property) => {
            const { data: address } = await AddressService.fetchAddress(property.addressId);

            if (address)
              return { ...property, address: address };
          });
          const propertiesToSave = await Promise.all(propertiesWithAddress);
          this.setState({ properties: propertiesToSave });
        }
      } catch (error) {
        console.log(error);
      }
    }
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1300);
    

  }

  setModalShow = (bool) => {
    this.setState({ modalShow: bool });
  }

  closeModal = () => {
    this.setState({ modalShow: false });
  }

  renderProperties = () => {
    const { properties } = this.state;

    return (

      <div>
        {properties && properties.length > 0
          ? (
            <Table hover className="mb-0" size="sm" responsive>
              {
                properties.map(property => (
                  <Property
                    key={property.id}
                    property={property}
                  />
                ))
              }
            </Table>
          )
          : this.renderNoProperties()
        }
      </div>
    );
  };

  renderNoProperties = () => {
    return (
      <div className="noProperties">
        <NoProperties height="500" width="500" />
      </div>
    );
  }


  render() {
    const { properties, organizationId, isLoading, modalShow } = this.state;

    return (
      <div className="mainContent">

        <PropertiesContext.Provider value={{
          fetchProperties: this.fetchProperties,
          properties: properties,
          auth: this.props.auth.getAccountId(),
          organizationId: this.state.organizationId,
          language: this.props.language
        }}>
          <div className="properties-title">
            <h2><Translate text="My Properties" /></h2>
          </div>
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => this.setModalShow(false)}>
            <PropertyForm closeModal={this.closeModal} />
          </MyVerticallyCenteredModal>


          {!isLoading ?
            (
              <div >
                <div>
                  {properties && properties.length > 0
                    ?
                    (
                      <div className="properties-cards">
                        <Table hover className="mb-0" size="sm" responsive>
                          {
                            properties.map(property => (
                              <Property
                                key={property.id}
                                property={property}
                              />
                            ))
                          }
                        </Table>
                      </div>
                    )
                    :
                    <div>
                      <div className="noProperties">
                        <NoProperties height="500" width="500" />

                      </div>
                      <div className="np-text">
                      {this.state.organizationId ?
                        <Translate text="Once you have a property, you'll see it listed here" />
                        :
                        <Translate text="You can't add a property if you don't belong to an organization" />
                      }
                      </div>
                      
                    </div>

                  }
                </div>
              </div>
            )
            :
            (<Loader size="medium" />)
          }

          <Button
            className="add"
            variant="primary"
            onClick={() => this.setModalShow(true)}
            disabled={!organizationId}
          >
            <Translate text="Add property" />
          </Button>
          <Link to="/profile#organization" className="link"><Translate text="Add or edit existing Organization" /></Link>

        </PropertiesContext.Provider>

      </div>
    );
  }
}

export default PropertiesContainer;