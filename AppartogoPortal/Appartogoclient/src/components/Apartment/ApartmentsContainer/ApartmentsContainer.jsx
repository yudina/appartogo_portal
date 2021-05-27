import React from 'react';
import './ApartmentsContainer.css'
import ApartmentCard from '../ApartmentCard';
import MyVerticallyCenteredModal from '../../Form/ModalContainer/MyVerticallyCenteredModal';
import ApartmentForm from '../../Form/ApartmentForm';
import { ReactComponent as NoApartments } from "../../../assets/noApartments.svg";
import properties from '../../Property/PropertiesContainer/properties';
import PropertiesContext from '../../../context/PropertiesContext';
import ApartmentsContext from '../../../context/ApartmentsContext';
import { Button } from 'react-bootstrap';
import ApartmentService from '../../../services/AppartementsService';
import { Loader } from '../../Loader/Loader';
import { Translate } from "react-translated";


class ApartmentsContainer extends React.Component {
  static contextType = PropertiesContext;

  state = {
    apartments: [],
    properties: [],
    modalShow: false,
    accountId: null,
    isLoading: true
  }

  async componentDidMount() {
    const { accountId } = this.state;
    this.setState({ isLoading: true })
    this.setState({ accountId: this.context.auth })
    this.setState({ properties: this.context.properties });
    if (accountId != '')
      await this.fetchApartments();
    this.setState({ isLoading: false })
  }

  fetchApartments = async () => {
    const { property, setApartmentsCount } = this.props;
    this.setState({ isLoading: true })
    try {
      let { data: allApartments } = await ApartmentService.fetchAppartments([property]);
        setApartmentsCount(allApartments.length);
        this.setState({ apartments: allApartments });
    } catch (error) {
      console.log(error)
    }
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 1200)
    
  }

  setModalShow = (bool) => {
    this.setState({ modalShow: bool });
  }

  closeModal = () => {
    this.setState({ modalShow: false });
  }


  renderApartments = () => {
    const { apartments } = this.state;
    return (
      apartments.length > 0 ?
        (apartments.map((apartment) => (
          <ApartmentCard
            key={apartment.id}
            apartment={apartment}
          />
        )))
        :
        null
    );

  }

  render() {

    const { apartments, modalShow, isLoading } = this.state;
    const { property } = this.props

    return (
      <div className="mainContent">
        <ApartmentsContext.Provider value={{
          fetchApartments: this.fetchApartments,
          apartments: apartments,
          properties: properties,
          property: property,
          language: this.props.language
        }}>
          {!isLoading ?
            (
              <div>
                <div className="properties-title">
                  <h2><Translate text="My Apartments" /></h2>
                </div>

                <Button variant="primary" onClick={() => this.setModalShow(true)}>
                  <Translate text="Add Apartment" />
                </Button>

                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => this.setModalShow(false)}>
                  <ApartmentForm closeModal={this.closeModal} properties={properties} />
                </MyVerticallyCenteredModal>

                <div className="apartments-cards">
                  {
                    this.renderApartments()
                  }
                </div>
              </div>
            )
            :
            (<Loader size="medium" />)
          }

        </ApartmentsContext.Provider>
      </div>
    );
  }
}


export default ApartmentsContainer;