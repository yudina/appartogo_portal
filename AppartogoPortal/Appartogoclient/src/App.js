import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout/Layout";

import { Provider as Translator } from "react-translated";
import translation from "./translation";

import PropertiesContainer from "./components/Property/PropertiesContainer";
import ListingsContainer from "./components/Listing/ListingsContainer";
import { Profile } from "./components/Profile/Profile";

import Auth from "./components/Auth/AuthProvider";
import AuthCallback from "./components/Auth/AuthCallback";
import "./App.css";
import ApplicationsHistory from "./components/Tenant/ApplicationsHistory/ApplicationsHistory";
import { TenantHousing } from "./components/Tenant/Housing/TenantHousing";
import { TenantDashboard } from "./components/Tenant/Dashboard/TenantDashboard";
import Chat from "./components/Chat/Chat";
import Tenants from "./components/Tenants/Tenants";
import OwnerDashboard from "./components/Owner/Dashboard/OwnerDashboard";
import SetupAccount from "./components/Auth/SetupAccount";
import OwnerApplications from "./components/OwnerApplications";
import Cookies from "js-cookie";
import Apply from "./components/Application/Apply";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { fetchConversations, onReceiveMessage } from "./redux/index";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history);
    this.state = { existingUser: true, language: "en", connection: null };
    this.connection = null;

    this.handleToggleLanguage = this.handleToggleLanguage.bind(this);
  }

  async componentDidMount() {
    if (Cookies.get("language")) {
      this.setState({ language: Cookies.get("language") });
    }

    this.auth
      .isExistingAccount()
      .then(async (bool) => {
        this.setState({ existingUser: bool });
        this.initChatConnection(this.auth.getAccountId());
        await this.props.fetchConversations(this.auth.getAccountId());
        this.connection.start().then(() => {
          this.connectionSuccessToast();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  connectionSuccessToast = () => {
    toast.success("📶 Connection Started!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  sendMessageHandler = async (message, conversationId) => {
    if (this.connection.connectionStarted) {
      try {
        await this.connection.invoke("JoinRoom", conversationId);
        await this.connection.send("SendMessage", message);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  handleToggleLanguage = () => {
    if (this.state.language === "en") {
      this.setState({ language: "fr" });
      Cookies.set("language", "fr");
    } else {
      this.setState({ language: "en" });
      Cookies.set("language", "en");
    }
  };

  initChatConnection = (accountId) => {
    this.connection = new HubConnectionBuilder()
      .withUrl(`chathub?username=${accountId}`)
      .withAutomaticReconnect()
      .build();
    this.connection.on("ReceiveMessage", (message) => {
      this.props.onReceiveMessage(message);
    });
  };

  renderSignIn = (Component) => {
    return (
      <div>
        {/*<Component auth={this.auth} {...this.props} /> */}
        {this.auth.isSignedIn() === true ? (
          this.state.existingUser === true ? (
            <Component
              auth={this.auth}
              language={this.state.language}
              connection={this.connection}
              sendMessageHandler={this.sendMessageHandler}
              {...this.props}
            />
          ) : (
            <SetupAccount
              auth={this.auth}
              language={this.state.language}
              {...this.props}
            />
          )
        ) : (
          this.auth.login()
        )}
      </div>
    );
  };

  render() {
    return (
      <Translator language={this.state.language} translation={translation}>
        <Layout
          auth={this.auth}
          language={this.state.language}
          toggleLanguage={() => {
            this.handleToggleLanguage();
          }}
        >
          <Route
            path="/"
            exact
            render={() => this.renderSignIn(TenantDashboard)}
          />

          {/* <Route path="/post-ad" exact render={() => this.renderSignIn(PostAd)} /> */}

          <Route
            path="/profile"
            exact
            render={() => this.renderSignIn(Profile)}
          />

          <Route
            exact
            path="/chat"
            exact
            render={() => this.renderSignIn(Chat)}
          />

          {/* OWNER PAGES */}

          <Route
            path="/owner-dashboard"
            exact
            render={() => this.renderSignIn(OwnerDashboard)}
          />

          <Route
            path="/applications"
            exact
            render={() => this.renderSignIn(OwnerApplications)}
          />

          <Route
            path="/listings"
            exact
            render={() => this.renderSignIn(ListingsContainer)}
          />

          <Route
            path="/properties"
            exact
            render={() => this.renderSignIn(PropertiesContainer)}
          />

          <Route
            path="/tenants"
            exact
            render={() => this.renderSignIn(Tenants)}
          />

          {/* TENANT PAGES */}

          <Route
            path="/tenant-dashboard"
            exact
            render={() => this.renderSignIn(TenantDashboard)}
          />

          <Route
            path="/housing"
            exact
            render={() => this.renderSignIn(TenantHousing)}
          />

          <Route
            path="/applications-history"
            exact
            render={() => this.renderSignIn(ApplicationsHistory)}
          />

          <Route path="/apply" exact render={() => this.renderSignIn(Apply)} />

          <Route
            path="/welcome"
            exact
            render={(props) => <AuthCallback auth={this.auth} {...props} />}
          />
          <ToastContainer />
        </Layout>
      </Translator>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchConversations: (accountId) => dispatch(fetchConversations(accountId)),
    onReceiveMessage: (message) => dispatch(onReceiveMessage(message)),
  };
};

export default connect(null, mapDispatchToProps)(App);
