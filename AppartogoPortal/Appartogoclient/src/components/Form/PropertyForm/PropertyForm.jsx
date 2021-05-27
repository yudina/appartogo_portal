import React, { useContext, useState } from "react";
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../FormInput/FormInput';
import FormCard from '../FormCard';
import PropertiesContext from '../../../context/PropertiesContext';
import './PropertyForm.css';
import AddressService from '../../../services/AddressService';
import PropertyService from '../../../services/PropertyService';
import { Loader } from "../../Loader/Loader";
import { Translate } from "react-translated";
import { propertySchemaEng, propertySchemaFr } from './PropertySchemas'
import { Spinner } from "react-bootstrap";

function PropertyForm({ editData, closeModal }) {

  const propertiesContext = useContext(PropertiesContext);
  const [submitted, setSubmitted] = useState(false);

  const modifyProperty = async (property) => {
    let res = await AddressService.updateAddress(property.address)
    delete property.address;
    return await PropertyService.putProperty(property);
  }

  const createProperty = async (property) => {

    const organizationId = propertiesContext.organizationId;

    let { data: addressId } = await AddressService.createAddress(property.address);
    delete property.address;
    let propertyToSend = { ...property, addressId: addressId, organizationId: organizationId };
    return await PropertyService.createProperty(propertyToSend);
  }

  const callback = (delay) => {
    delay();
  }

  return (
    <Formik
      initialValues={!editData ? {
        address: {
          civicNumber: '',
          streetName: '',
          city: '',
          postalCode: '',
          country: '',
          state: '',
          apartmentNumber: '',
        },
        apartmentCount: 0,
        canSmoke: false,
        animalsFriendly: false,
      } :
        {
          id: editData.id,
          addressId: editData.addressId,
          organizationId: editData.organizationId,
          address: editData.address,
          apartmentCount: editData.apartmentCount,
          canSmoke: editData.canSmoke,
          animalsFriendly: editData.animalsFriendly
        }
      }
      validationSchema={
        propertiesContext.language === 'eng' ? propertySchemaEng : propertySchemaFr
      }
      onSubmit={async (values) => {
        setSubmitted(true);
        console.log('debut')
        try {
          let result;
          if (editData) {
            result = await modifyProperty(values);
          } else {
            result = await createProperty(values);
          }
          setSubmitted(false);
          closeModal()
          await propertiesContext.fetchProperties();
        } catch (error) {
          console.log(error)
        }

        //window.location.reload();
      }}

    >
      {(formik, isSubmitting) => (
        <Form>
          <FormCard mainTitle={"Property Form"} title={"Address"} no={1}>
            <FormInput
              label={<Translate text="Civic Number" />}
              property="address.civicNumber"
              type="text"
              formik={formik}

            />
            <FormInput
              label={<Translate text="Street Name" />}
              property="address.streetName"
              type="text"
              formik={formik}
            />
            <FormInput
              label={<Translate text="City" />}
              property="address.city"
              type="text"
              formik={formik}
            />
            <FormInput
              label={<Translate text="Province" />}
              property="address.state"
              type="text"
              formik={formik}
            />
            <FormInput
              label={<Translate text="Postal Code" />}
              property="address.postalCode"
              type="text"
              formik={formik}
            />
            <FormInput
              label={<Translate text="Country" />}
              property="address.country"
              type="text"
              formik={formik}
            />

          </FormCard>
          <FormCard title="Conveniance" no={2}>
            <FormInput
              label={<Translate text="Accepts animals" />}
              property="animalsFriendly"
              type="checkbox"
              formik={formik}
            />
            <FormInput
              label={<Translate text="Allows smoking" />}
              property="canSmoke"
              type="checkbox"
              formik={formik}
            />
          </FormCard>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary pull-right"
              disabled={submitted}
            >{!submitted ?
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

export default PropertyForm
