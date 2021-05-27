import * as yup from "yup";

export const schema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  phone: yup.string(),
  civicNumber: yup.string(),
  street: yup.string(),
  apart: yup.string(),
  city: yup.string(),
  province: yup.string(),
  postalCode: yup.string(),
  consentCreditCheck: yup.bool(),
  consentInsurance: yup.bool(),
  file: yup.string(),
  message: yup.string().required("You must include a message"),
});

export const schemaFr = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  phone: yup.string(),
  civicNumber: yup.string(),
  street: yup.string(),
  apart: yup.string(),
  city: yup.string(),
  province: yup.string(),
  postalCode: yup.string(),
  consentCreditCheck: yup.bool(),
  consentInsurance: yup.bool(),
  file: yup.string(),
  message: yup.string().required("Vous devez inclure un message"),
});
