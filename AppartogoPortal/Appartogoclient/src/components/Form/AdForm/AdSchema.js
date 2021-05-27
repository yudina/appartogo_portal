import * as Yup from "yup";

export const AdSchemaEng = Yup.object().shape({
  titre: Yup.string()
    .min(1, 'Must be more than 0 characters')
    .max(250, 'Must be less than 250 characters')
    .required(' Title is Required ! '),
  description: Yup.string()
    .min(1, 'Must be more than 0 characters')
    .max(1000, 'Must be less than 1000 characters')
    .required(' Description is Required ! '),
  rent: Yup.number()
    .min(1, 'Must be greater than 0')
    .required(' Rent is Required ! '),
  apartmentId: Yup.string()
    .min(3, 'Must select an Apartment')
    .required('Must select an Apartment')

})


export const AdSchemaFr = Yup.object().shape({
  titre: Yup.string()
    .min(1, 'Doit contenir plus de 0 caractères')
    .max(250, 'Doit contenir moins de 250 caractères')
    .required('Le titre est obligatoire!'),
  description: Yup.string()
    .min(1, 'Doit contenir plus de 0 caractères')
    .max(1000, 'Doit contenir moins de 1000 caractères')
    .required(' Une description est requise! '),
  rent: Yup.number()
    .min(1, 'Doit être supérieur à 0')
    .required(' Le loyer est obligatoire! '),
  apartmentId: Yup.string()
    .min(3, 'Appartement obligatoire')
    .required('Appartement obligatoire')

})