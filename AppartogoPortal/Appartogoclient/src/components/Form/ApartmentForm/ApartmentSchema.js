import * as Yup from "yup";

export const ApartmentSchemaEng = Yup.object().shape({
  apartmentNumber: Yup.string()
    .min(1, 'Must be more than 0 characters')
    .max(50, 'Must be less than 50 characters')
    .required(' Apartment number is Required ! '),
  apartmentType: Yup.string()
    .min(1, 'Must be more than 0 characters')
    .max(50, 'Must be less than 50 characters')
    .required(' Apartment Type Required ! '),
  size: Yup.string()
    .min(1, 'Must be more than 0 characters')
    .max(50, 'Must be less than 50 characters')
    .required(' Required ! '),
  bathrooms: Yup.number()
    .min(1, 'Must be greater than 0')
    .required(' Number of bathrooms is Required ! '),
  rooms: Yup.number()
    .min(1, 'Must be greater than 0')
    .required(' Number of rooms Required ! '),

});

export const ApartmentSchemaFr = Yup.object().shape({
  apartmentNumber: Yup.string()
    .min(1, 'Doit contenir plus de 0 caractères')
    .max(50, 'Doit contenir moins de 50 caractères')
    .required('Le numéro d\'appartement est obligatoire'),
  apartmentType: Yup.string()
    .min(1, 'Doit contenir plus de 0 caractères')
    .max(50, 'Doit contenir moins de 50 caractères')
    .required('Type d\'appartement requis! '),
  size: Yup.string()
    .min(1, 'Doit contenir plus de 0 caractères')
    .max(50, 'Doit contenir moins de 50 caractères')
    .required(' Required ! '),
  bathrooms: Yup.number()
    .min(1, 'Doit contenir plus de 0 caractères')
    .required('Le nombre de salles de bain est requis ! '),
  rooms: Yup.number()
    .min(1, 'Doit contenir plus de 0 caractères')
    .required(' Nombre de chambres requis! '),

});