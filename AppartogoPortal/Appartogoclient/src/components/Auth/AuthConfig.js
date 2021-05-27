// https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
// https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
const policiesB2C = {
  authorities: {
    signUpSignIn: {
      authority:
        "https://appartogodev.b2clogin.com/appartogodev.onmicrosoft.com/b2c_1_signupsignin1",
    },
    forgotPassword: {
      authority:
        "https://appartogodev.b2clogin.com/appartogodev.onmicrosoft.com/b2c_1_passwordreset",
    },
  },
};

// msal.js configuration parameters
// https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_configuration_.html
const configMSAL = {
  auth: {
    authority: policiesB2C.authorities.signUpSignIn.authority,
    clientId: process.env.REACT_APP_APPARTOGO_B2C_APP_CLIENT_ID,
    redirectUri: process.env.REACT_APP_APPARTOGO_B2C_APP_REDIRECT_URL,
    validateAuthority: false,
  },
  cache: {
    cacheLocation: "localStorage", // for multiple sessions
    storeAuthStateInCookie: false, // IE support
  },
};

// msal.js authentication parameters
// https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
const loginScopes = {
  scopes: ["openid", "profile"],
};

export { configMSAL, loginScopes };
