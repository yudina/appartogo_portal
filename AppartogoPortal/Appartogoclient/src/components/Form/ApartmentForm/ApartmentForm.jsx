import React, { useContext, useState } from "react";
import { Form, Formik, Field } from 'formik'
import './ApartmentForm.css';
import FormInput from '../FormInput/FormInput';
import FormCard from '../FormCard';
import ApartmentService from '../../../services/AppartementsService';
import ApartmentsContext from '../../../context/ApartmentsContext';
import PropertiesContext from '../../../context/PropertiesContext';
import "react-datepicker/dist/react-datepicker.css";
import { Translate } from "react-translated";
//import { Form } from 'react-bootstrap';

import {
  Col,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { ApartmentSchemaEng, ApartmentSchemaFr } from "./ApartmentSchema";
import { Spinner } from "react-bootstrap";

function ApartmentForm({ editData, closeModal, language }) {

  const apartmentsContext = useContext(ApartmentsContext);
  const propertiesContext = useContext(PropertiesContext);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Formik
      initialValues={!editData ? {
        apartmentNumber: '',
        apartmentType: '',
        rooms: 0,
        bathrooms: 0,
        size: '',
        hasWater: false,
        hasHeater: false,
        hasParking: false,
        hasFurniture: false,
        hasAirconditioner: false,
        hasCable: false,
        hasInternet: false,
        availibityDate: new Date(),
        propertyId: apartmentsContext.property.id
      } :
        {
          id: editData.id,
          apartmentNumber: editData.apartmentNumber,
          apartmentType: editData.apartmentType,
          tenantId: editData.tenantId,
          propertyId: editData.propertyId,
          rooms: editData.rooms,
          bathrooms: editData.bathrooms,
          size: editData.size,
          hasWater: editData.hasWater,
          hasHeater: editData.hasHeater,
          hasParking: editData.hasParking,
          hasFurniture: editData.hasFurniture,
          hasAirconditioner: editData.hasAirconditioner,
          hasCable: editData.hasCable,
          hasInternet: editData.hasInternet,
          availibityDate: new Date(`${editData.availibityDate}`)
        }
      }
      validationSchema={apartmentsContext.language === "en" ? ApartmentSchemaEng : ApartmentSchemaFr}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitted(true);
        console.log('values', values)
        try {
          let result;
          if (editData) {
            result = await ApartmentService.modifyAppartment(values);
          } else {
            result = await ApartmentService.createAppartment(values);
          }

        } catch (error) {
          console.log(error)
        }

        setSubmitted(false);
        closeModal()
        await apartmentsContext.fetchApartments();
      }}

    >
      {(formik, isSubmitting) => (
        <Form>
          {console.log('props', language)}
          <FormCard mainTitle={"Apartment Form"} title={"Feature"} no={1}>
            <FormGroup row>
              <Label for="propertyId" sm={3}>
                <Translate text="Property" />
              </Label>
              <Col sm={9}>
                <Input
                  type="select"
                  name="propertyId"
                  id="propertyId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.propertyId}
                >
                  <option defaultValue="">Select a Property</option>
                  {propertiesContext.properties.map((property) => (
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
              </Col>
            </FormGroup>

            <FormInput
              label={<Translate text="Apartment Number" />}
              property="apartmentNumber"
              type="text"
              formik={formik}
            />
            <FormInput
              label={<Translate text="Type" />}
              property="apartmentType"
              type="text"
              formik={formik}
            />
            <FormInput
              label={<Translate text="Number of rooms " />}
              property="rooms"
              type="number"
              formik={formik}
            />
            <FormInput
              label={<Translate text="Number of bathrooms" />}
              property="bathrooms"
              type="number"
              formik={formik}
            />

            <div id="my-radio-group"><Translate text="Size" /></div>
            <div role="group" aria-labelledby="my-radio-group">
              <label className="apart-radio">
                <Field type="radio" name="size" value="1½-2½" />
                {' 1½-2½'}
              </label>
              <label className="apart-radio">
                <Field type="radio" name="size" value="3½" />
                {' 3½'}
              </label>
              <label className="apart-radio">
                <Field type="radio" name="size" value="4½" />
                {' 4½'}
              </label>
              <label className="apart-radio">
                <Field type="radio" name="size" value="5½" />
                {' 5½'}
              </label>
              <label className="apart-radio">
                <Field type="radio" name="size" value="6½+" />
                {' 6½+'}
              </label>
            </div>

            <FormInput
              label={<Translate text="Availability Date" />}
              property="availibityDate"
              type="DatePicker"
              datePicker={true}
              formik={formik}
            />

          </FormCard>
          <FormCard title="Conveniance" no={2}>
            <FormInput
              label={<Translate text="Water" />}
              property="hasWater"
              type="checkbox"
              formik={formik}
            />

            <FormInput
              label={<Translate text="Heater" />}
              property="hasHeater"
              type="checkbox"
              formik={formik}
            />

            <FormInput
              label={<Translate text="Parking" />}
              property="hasParking"
              type="checkbox"
              formik={formik}
            />

            <FormInput
              label={<Translate text="Supply" />}
              property="hasFurniture"
              type="checkbox"
              formik={formik}
            />

            <FormInput
              label={<Translate text="Air Conditioner" />}
              property="hasAirconditioner"
              type="checkbox"
              formik={formik}
            />

            <FormInput
              label={<Translate text="Cable" />}
              property="hasCable"
              type="checkbox"
              formik={formik}
            />

            <FormInput
              label={<Translate text="Internet" />}
              property="hasInternet"
              type="checkbox"
              formik={formik}
            />

          </FormCard>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitted}>
              {!submitted ?
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
  );
}

export default ApartmentForm
