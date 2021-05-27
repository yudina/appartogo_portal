import * as yup from "yup";

export const addressSchema = yup.object({
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
});

export const phoneSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\d{10}$/, "phone must be 10 digits")
    .required("required field"),
});

export const organizationSchema = yup.object({
  organisationName: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "please input a valid organization name"
    )
    .required("required field"),

  orgCivicNumber: yup
    .string()
    .matches(/^[0-9]{1,8}$/, "please input a valid civic #")
    .required("required field"),

  orgStreet: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "please input a valid street"
    )
    .required("required field"),

  orgApart: yup
    .string()
    .matches(/^[A-Za-z0-9\-]{0,8}$/, "please input a valid apart #")
    .notRequired(),

  orgCity: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "please input a valid city"
    )
    .required("required field"),

  orgProvince: yup
    .string()
    .matches(/(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)/, "please select a province")
    .required("required"),

  orgPostalCode: yup
    .string()
    .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "please input a valid postal code")
    .required("required field"),
});

export const addressSchemaFr = yup.object({
  civicNumber: yup
    .string()
    .matches(/^[0-9]{1,8}$/, "veuillez entrer un # civique valide")
    .required("veuillez entrer un nom de rue valide"),
  street: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer un nom de rue valide"
    )
    .required("veuillez entrer un nom de rue valide"),
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
});

export const phoneSchemaFr = yup.object({
  phone: yup
    .string()
    .matches(/^\d{10}$/, "téléphone doit être de 10 chiffres")
    .required("champ requis"),
});

export const organizationSchemaFr = yup.object({
  organisationName: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer un nom valide"
    )
    .required("champ requis"),

  orgCivicNumber: yup
    .string()
    .matches(/^[0-9]{1,8}$/, "veuillez entrer un # civique valide")
    .required("champ requis"),

  orgStreet: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer un nom de rue valide"
    )
    .required("champ requis"),

  orgApart: yup
    .string()
    .matches(/^[A-Za-z0-9\-]{0,8}$/, "veuillez entrer un apart # valide")
    .notRequired(),

  orgCity: yup
    .string()
    .matches(
      /^(?=.{1,40}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(?:[-'\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+)*$/,
      "veuillez entrer une ville valide"
    )
    .required("champ requis"),

  orgProvince: yup
    .string()
    .matches(/(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)/, "veuillez sélectionner une province")
    .required("requis"),

  orgPostalCode: yup
    .string()
    .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "veuillez entrer un code postal valide")
    .required("champ requis"),
});
