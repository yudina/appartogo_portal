import Axios from "axios";
import * as msal from "msal";
import { configMSAL, loginScopes } from "./AuthConfig";

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userAgentApplication = new msal.UserAgentApplication(configMSAL);
    this.accountJSON = "";
  }

  async handleRedirectPromise() {
    this.userAgentApplication.handleRedirectCallback(async (error, loginReponse) => {
      if (error) {
        await this.handleLoginError(error);
      } else {
        this.handleLoginSuccess(loginReponse);
      }
    });

    this.history.push("/welcome");
  }

  async handleLoginError(loginError) {
    console.error(`Error while signing in: ${JSON.stringify(loginError)}`);
  }

  handleLoginSuccess(loginResponse) {
    if (
      // valid identity token
      loginResponse != null &&
      loginResponse.tokenType === "id_token" &&
      loginResponse.idToken?.issuer === process.env.REACT_APP_APPARTOGO_B2C_IDTOKEN_ISSUER
    ) {
    } else {
      console.log("Invalid token or Error signing in. Logging out...");
      this.userAgentApplication.logout();
    }
  }

  async getAccessToken(scopes) {
    let loginRequest = loginScopes;
    loginRequest.scopes = scopes;
    let response = await this.userAgentApplication
      .acquireTokenSilent(loginRequest)
      .catch(async (e) => {
        console.error(`Can't get access token for scopes: ${scopes}. Error: ${e}`);
      });
    return response.accessToken;
  }

  login() {
    this.userAgentApplication.loginRedirect(loginScopes);
  }

  logout() {
    this.userAgentApplication.logout();
  }

  isSignedIn() {
    return this.userAgentApplication.getAccount() == null ? false : true;
  }

  getUserSignedInDetails() {
    return this.isSignedIn() ? this.userAgentApplication.getAccount() : null;
  }

  getAccountId() {
    return this.isSignedIn() ? this.getUserSignedInDetails().accountIdentifier : null;
  }

  async isExistingAccount() {
    if (this.accountJSON && this.accountJSON.id === this.getAccountId()) {
      return true;
    } else if (this.getAccountId()) {
      const res = await Axios.get(`/Account/${this.getAccountId()}`).catch((err) => {
        console.log(err);
        return false;
      });

      if (res) {
        if (res.status === 200) {
          this.accountJSON = res.data;
          return true;
        } else if (res.status === 204) {
          return false;
        } else {
          console.log("other error from server");
          return false;
        }
      } else {
        console.log("other error from server");
        return false;
      }
    } else {
      return false;
    }
  }
}
