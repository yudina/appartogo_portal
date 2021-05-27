import * as yup from "yup";

export const schema = yup.object({
  firstName: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "please input a valid first name"
    )
    .required("required field"),
  lastName: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "please input a valid last name"
    )
    .required("required field"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "phone must be 10 digits")
    .required("required field"),
  civicNumber: yup
    .string()
    .matches(/^[0-9]{1,8}$/, "please input a valid civic #")
    .required("required field"),
  street: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "please input a valid street"
    )
    .required("required field"),
  apart: yup
    .string()
    .matches(/^[A-Za-z0-9\-]{0,8}$/, "please input a valid apart #")
    .notRequired(),
  city: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "please input a valid city"
    )
    .required("required field"),
  province: yup
    .string()
    .matches(/(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)/, "please select a province")
    .required("required"),
  postalCode: yup
    .string()
    .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "please input a valid postal code")
    .required("required field"),

  isOwner: yup.bool(),

  organisationName: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "please input a valid organization name"
      )
      .required("required field"),
    otherwise: yup.string(),
  }),

  orgCivicNumber: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/^[0-9]{1,8}$/, "please input a valid civic #")
      .required("required field"),
    otherwise: yup.string(),
  }),

  orgStreet: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "please input a valid street"
      )
      .required("required field"),
    otherwise: yup.string(),
  }),

  orgApart: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/^[A-Za-z0-9\-]{0,8}$/, "please input a valid apart #")
      .notRequired(),
    otherwise: yup.string().notRequired(),
  }),

  orgCity: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "please input a valid city"
      )
      .required("required field"),
    otherwise: yup.string(),
  }),

  orgProvince: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)/, "please select a province")
      .required("required"),
    otherwise: yup.string(),
  }),

  orgPostalCode: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "please input a valid postal code")
      .required("required field"),
    otherwise: yup.string(),
  }),
  // terms: yup.bool().required("You must accept the terms and conditions"),
});

export const schemaFr = yup.object({
  firstName: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer un prénom valide"
    )
    .required("champ requis"),
  lastName: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer un nom valide"
    )
    .required("champ requis"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "téléphone doit être de 10 chiffres")
    .required("champ requis"),
  civicNumber: yup
    .string()
    .matches(/^[0-9]{1,8}$/, "veuillez entrer un # civique valide")
    .required("champ requis"),
  street: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer un nom de rue valide"
    )
    .required("champ requis"),
  apart: yup
    .string()
    .matches(/^[A-Za-z0-9\-]{0,8}$/, "veuillez entrer un apart # valide")
    .notRequired(),
  city: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer une ville valide"
    )
    .required("champ requis"),
  province: yup
    .string()
    .matches(/(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)/, "veuillez sélectionner une province")
    .required("requis"),
  postalCode: yup
    .string()
    .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "veuillez entrer un code postal valide")
    .required("champ requis"),

  isOwner: yup.bool(),

  organisationName: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "veuillez entrer un nom valide"
      )
      .required("champ requis"),
    otherwise: yup.string(),
  }),

  orgCivicNumber: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/^[0-9]{1,8}$/, "veuillez entrer un # civique valide")
      .required("champ requis"),
    otherwise: yup.string(),
  }),

  orgStreet: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "veuillez entrer un nom de rue valide"
      )
      .required("champ requis"),
    otherwise: yup.string(),
  }),

  orgApart: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/^[A-Za-z0-9\-]{0,8}$/, "veuillez entrer un apart # valide")
      .notRequired(),
    otherwise: yup.string().notRequired(),
  }),

  orgCity: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(
        /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
        "veuillez entrer une ville valide"
      )
      .required("champ requis"),
    otherwise: yup.string(),
  }),

  orgProvince: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)/, "veuillez sélectionner une province")
      .required("champ requis"),
    otherwise: yup.string(),
  }),

  orgPostalCode: yup.string().when(`isOwner`, {
    is: true,
    then: yup
      .string()
      .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "veuillez entrer un code postal valide")
      .required("champ requis"),
    otherwise: yup.string(),
  }),
  // terms: yup.bool().required("You must accept the terms and conditions"),
});
