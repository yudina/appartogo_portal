import React, { Component, useContext } from "react";
import { Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import FormInput from '../FormInput/FormInput';
import FormCard from '../FormCard';
import ListingsContext from '../../../context/ListingsContext';
import AttachmentService from '../../../services/AttachmentsService';
import ListingService from '../../../services/ListingsService';
import Gallery from 'react-grid-gallery';
import { Translate } from "react-translated";
//import { Form } from 'react-bootstrap'

import {
  Col,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { Loader } from "../../Loader/Loader";
import { AdSchemaEng, AdSchemaFr } from "./AdSchema";
import ApartmentsContext from "../../../context/ApartmentsContext";
import { Spinner } from "react-bootstrap";

class AdForm extends Component {

  static contextType = ListingsContext;

  constructor(props) {
    super(props);

    this.state = {
      propertyId: 0,
      apartmentsFiltered: [],
      isSubmitting: false,
      attachments: [],
      fileUrl: null,
      currentImage: 0,
      images: [],
      isGalleryLoading: true,
      submitted: false
    }
    this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
    this.deleteImage = this.deleteImage.bind(this);


  }


  static contextType = ListingsContext;

  setSubmitted = (bool) => {
    this.setState({ submitted: bool });
  }

  async componentDidMount() {
    const { editData } = this.props
    this.setState({ isGalleryLoading: true });
    if (this.props.editData) {
      this.setState({
        propertyId: editData.apartment.propertyId,
      });
      this.filterApartments(editData.apartment.propertyId);
      await this.loadImages();
    }
    this.setState({ isGalleryLoading: false });
  }

  loadImages = async () => {
    if (this.props.editData) {
      let images = await Promise.all([
        ...this.props.editData.attachments.map(async (attachment) => {
          let imageSrc = null;
          try {
            imageSrc = await import(`../../../assets/listingPictures/${attachment.id}${attachment.type}`).then(image => image.default)
          } catch (err) {
            console.log(err)
            import(`../../../assets/listingPictures/no-image.png`).then(image => {
              imageSrc = image.default;
            }).catch(err => console.log(err))
          }

          return {
            src: imageSrc,
            thumbnail: imageSrc,
            thumbnailWidth: 320,
            thumbnailHeight: 212,
            id: attachment.id,
            caption: attachment.name.slice(0, attachment.name.indexOf('.'))
          }
        })
      ]);
      this.setState({
        images: [...this.state.images, ...images]
      })
      let attachments = this.props.editData.attachments.map(attachment => ({ ...attachment, state: 'none' }));
      this.setState({
        attachments: attachments
      })
    }
  }

  filterApartments = (id) => {
    const { apartments } = this.props
    const filtered = apartments.filter(apartment => apartment.propertyId === id);
    this.setState({ apartmentsFiltered: filtered });
  }

  propertyOnChange = (event) => {
    this.setState({ propertyId: event.target.value });
    this.filterApartments(event.target.value)
  }

  handleFileSelected = async (event) => {

    if (event.target.files[0] != null) {
      const thumbnail = {
        src: URL.createObjectURL(event.target.files[0]),
        thumbnail: URL.createObjectURL(event.target.files[0]),
        thumbnailWidth: 320,
        thumbnailHeight: 212
      };

      const attachment = {
        file: event.target.files[0],
        state: 'new'
      }

      await this.setState({
        images: [...this.state.images, thumbnail],
        attachments: [...this.state.attachments, attachment]
      });
    }
  }

  createImages = async (listingId) => {
    const { attachments } = this.state;

    await Promise.all([...attachments.map(async (attachment) => {
      let res = await this.createImage(listingId, attachment.file)
    })]);
  }

  createImage = async (listingId, attachment) => {
    if (attachment) {
      var fd = new FormData();
      fd.append('AttachmentFile', attachment);
      fd.append('listingId', listingId);
      fd.append('name', attachment.name);
      fd.append('type', attachment.name.slice(attachment.name.indexOf('.'), attachment.name.length));

      return await AttachmentService.createAttachment(fd);
    }

  }

  modifyImage = async (listingId) => {
    const { attachments } = this.state;
    await Promise.all([...attachments.map(async attachment => {
      if (attachment.state) {
        if (attachment.state === 'new') {
          let resCreate = await this.createImage(listingId, attachment.file);
        }
        else if (attachment.state === 'delete') {
          let resDelete = await AttachmentService.deleteAttachment(attachment);
        }
      }
    })])
  }

  modifyListing = async (listing) => {
    delete listing.apartment;
    delete listing.attachment;
    console.log('listing', listing)
    return await ListingService.modifyListing(listing);
  }

  createListing = async (listing) => {
    delete listing.apartment;
    return await ListingService.createlisting(listing);
  }

  onCurrentImageChange(index) {
    this.setState({ currentImage: index });
  }

  deleteImage() {
    const { currentImage, images, attachments } = this.state;
    if (images.length > 0 && currentImage >= 0) {
      if (window.confirm(`Are you sure you want to delete the image ?`)) {
        let image = images[currentImage];
        let newAttachments = attachments.map(attachment => {
          if (attachment.id === image.id) {
            return { ...attachment, state: 'delete' };
          } else {
            return attachment;
          }
        });
        if (newAttachments.length > 0) {
          this.setState({ attachments: newAttachments });
        }
        let newImages = images.slice();
        newImages.splice(currentImage, 1)
        this.setState({
          images: newImages,
          currentImage: this.state.currentImage - 1
        });
      }
    }
  }

  render() {

    const { editData, properties, apartment } = this.props;
    const { isSubmitting, attachments, isGalleryLoading } = this.state;
    return (
      <ListingsContext.Consumer>
        {(context) => (
          <Formik
            initialValues={!editData ? {
              titre: '',
              description: '',
              rent: 0,
              apartmentId: apartment ? apartment.id : '',
              postedDateTime: new Date(),
              archived: false
            } :
              {
                id: editData.id,
                titre: editData.titre,
                description: editData.description,
                rent: editData.rent,
                postedDateTime: new Date(`${editData.postedDateTime}`),
                apartmentId: editData.apartmentId,
                attachment: editData.attachment,
                archived: editData.archived,
              }
            }
            validationSchema={this.props.language === "en" ? AdSchemaEng : AdSchemaFr}
            onSubmit={async (values, { setSubmitting }) => {
              this.setSubmitted(true)
              try {

                let result;
                if (editData) {
                  if (attachments.length > 0) {
                    let res = await this.modifyImage(values.id)
                  }
                  result = await this.modifyListing(values);
                } else {
                  let { data: listingId } = await this.createListing(values);
                  if (attachments.length > 0) {
                    let res = await this.createImages(listingId);
                  }
                }

              } catch (error) {
                console.log(error)
              }

              this.setSubmitted(true)
              this.props.closeModal();
              if (this.context) await this.context.fetchListings();
            }}

          >
            {(formik, isSubmitting, setFieldValue) => (
              <Form>
                {console.log('images', this.state.images)}
                <FormCard mainTitle={"Listing Form"} no={1}>
                  <FormInput
                    label={<Translate text="Title" />}
                    property="titre"
                    type="text"
                    formik={formik}
                  />

                  <FormInput
                    label={<Translate text="Description" />}
                    property="description"
                    type="text"
                    textArea={true}
                    formik={formik}
                  />
                  <FormInput
                    label={<Translate text="Rent" />}
                    property="rent"
                    type="number"
                    formik={formik}
                  />
                  <FormInput
                    label={<Translate text="Posted Date" />}
                    property="postedDateTime"
                    type="DatePicker"
                    formik={formik}
                  />

                  <FormGroup row>
                    <Label sm={3}>
                      {<Translate text="Select Images" />}
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="file" accept="image/*"
                        onChange={this.handleFileSelected}
                        style={{ display: "block" }}
                        disabled={this.state.images.length >= 8 ? true : false}
                      />
                    </Col>

                  </FormGroup>

                  {isGalleryLoading ?
                    (<Loader size="medium" />)
                    :
                    <Gallery
                      images={this.state.images}
                      enableLightbox={true}
                      showLightboxThumbnails={true}
                      enableImageSelection={false}
                      currentImageWillChange={this.onCurrentImageChange}
                      backdropClosesModal={true}
                      customControls={[
                        <button key="deleteImage" onClick={this.deleteImage}>{
                          this.props.language === 'en' ? 'Delete Image' : 'Supprimer l\'image'
                        }</button>
                      ]}
                    />
                  }


                </FormCard>

                { !this.props.apartment &&
                  <FormCard>
                    <FormGroup row>
                      <Label sm={3}>
                        {<Translate text="Select a Property" />}
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="select"
                          name="this.state.propertyId"
                          id="this.state.propertyId"
                          onChange={this.propertyOnChange}
                          onBlur={formik.handleBlur}
                          value={this.state.propertyId}

                        >
                          <option defaultValue={''}>Select a Property</option>
                          {properties.map((property) => (
                            <option
                              key={property.id}
                              value={property.id}
                              label={
                                property.address.civicNumber + ' ' +
                                property.address.streetName + ' ' +
                                property.address.city
                              }
                            ></option>
                          ))}
                        </Input>
                        {
                          formik.errors[this.state.propertyId]
                            && formik.touched[this.state.propertyId]
                            ?
                            (
                              <div className="invalid-feedback">
                                <ErrorMessage
                                  component="div"
                                  name="this.state.propertyId"
                                  className="input-feedback"
                                />
                              </div>
                            ) :
                            null
                        }
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label sm={3}>
                        {<Translate text="Select an Apartement" />}
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="select"
                          name="apartmentId"
                          id="apartmentId"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.apartmentId}
                          className={
                            formik.errors.apartmentId && formik.touched.apartmentId
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                        >
                          <option defaultValue={''}>Select an Apartment</option>
                          {this.state.apartmentsFiltered.map((apartment) => (
                            <option
                              key={apartment.id}
                              value={apartment.id}
                              label={
                                apartment.apartmentNumber + ' ' +
                                apartment.apartmentType + ' ' +
                                apartment.size
                              }
                            ></option>
                          ))}
                        </Input>
                        {
                          formik.errors.apartmentId
                            && formik.touched.apartmentId
                            ?
                            (
                              <div className="invalid-feedback">
                                <ErrorMessage
                                  component="div"
                                  name="apartmentId"
                                  className="input-feedback"
                                />
                              </div>
                            ) :
                            null
                        }
                      </Col>
                    </FormGroup>

                  </FormCard>
                }


                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary pull-right"
                    disabled={this.state.submitted}>
                    {!this.state.submitted ?
                      <Translate text="Submit" />
                      :
                      <div className="submitButton">
                        <Translate text="Loading ..." />
                        <Spinner className="submit-spinner" animation="border" size="sm" />
                      </div>
                    }
                  </button>
                </div>
              </Form>
            )}
          </Formik >
        )}
      </ListingsContext.Consumer>
    );
  }

}

export default AdForm
