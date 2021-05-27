import * as Yup from "yup";

export const propertySchemaEng = Yup.object().shape({
  address: Yup.object().shape({
    civicNumber: Yup.string()
      .matches(/^[0-9]{1,8}$/, "please input a valid civic #")
      .min(1, 'Must be more than 1 characters')
      .max(30, 'Must be less than 30 characters')
      .required(' Civic number is required ! '),
    streetName: Yup.string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "please input a valid street"
      )
      .min(1, 'Must be more than 1 characters')
      .max(50, 'Must be less than 50 characters')
      .required(' Street Name is Required ! '),
    city: Yup.string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "please input a valid city"
      )
      .min(1, 'Must be more than 1 characters')
      .max(50, 'Must be less than 50 characters')
      .required('City is Required ! '),
    postalCode: Yup.string()
      .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "please input a valid postal code")
      .min(1, 'Must be more than 1 characters')
      .max(10, 'Must be less than 10 characters')
      .required('Postal Code is Required ! '),
    country: Yup.string()
      .min(1, 'Must be more than 1 characters')
      .max(75, 'Must be less than 75 characters')
      .required('Country is Required ! '),
    state: Yup.string()
      .min(1, 'Must be more than 1 characters')
      .max(50, 'Must be less than 50 characters')
      .required('State is Required ! '),
  })
});

export const propertySchemaFr = Yup.object().shape({
  address: Yup.object().shape({
    civicNumber: Yup.string()
      .matches(/^[0-9]{1,8}$/, "veuillez saisir un # civique valide")
      .min(1, 'Doit contenir plus de 1 caractères')
      .max(30, 'Doit contenir moins de 30 caractères')
      .required(' Le numéro civique est requis!'),
    streetName: Yup.string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "veuillez saisir une rue valide"
      )
      .min(1, 'Doit contenir plus de 1 caractères')
      .max(50, 'Doit contenir moins de 50 caractères')
      .required(' Le nom de la rue est obligatoire! '),
    city: Yup.string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "veuillez saisir une ville valide"
      )
      .min(1, 'Doit contenir plus de 1 caractères')
      .max(50, 'Doit contenir moins de 50 caractères')
      .required('La ville est obligatoire! '),
    postalCode: Yup.string()
      .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "veuillez saisir un code postal valide")
      .min(1, 'Doit contenir plus de 1 caractères')
      .max(10, 'Doit contenir moins de 10 caractères')
      .required('Le code postal est obligatoire!'),
    country: Yup.string()
      .min(1, 'Doit contenir plus de 1 caractères')
      .max(75, 'Doit contenir moins de 75 caractères')
      .required('Le pays est obligatoire!'),
    state: Yup.string()
      .min(1, 'Doit contenir plus de 1 caractères')
      .max(50, 'Doit contenir moins de 50 caractères')
      .required('La province est requise!'),
  })
});