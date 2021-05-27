import React, { Component } from "react";
import image from "../../assets/profileImage.jpg";
import { ReactComponent as NoApplicants } from "../../assets/noApplicants.svg";
import { ReactComponent as NoData } from "../../assets/noData.svg";
import { ToastContainer } from "react-toastify";
import {
  FaThumbsDown,
  FaThumbsUp,
  FaComments,
  FaFileAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { Tabs, Tab, Dropdown, DropdownButton, Button } from "react-bootstrap";
import "./OwnerApplications.css";
import HeadTable from "../../common/Table/HeadTable";
import PageHeader from "../../common/PageHeader";
import StatusIndicator from "../../common/Table/StatusIndicator";
import OwnerApplication from "./OwnerApplication";
import moment from "moment";
import AppartementsService from "../../services/AppartementsService";
import PropertyService from "../../services/PropertyService";
import ListingsService from "../../services/ListingsService";
import ApplicationsService from "../../services/ApplicationsService";
import TenantsService from "../../services/TenantsService";
import AccountsService from "../../services/AccountsService";
import ConversationService from "../../services/ConversationService";
import OrganizationService from "../../services/OrganizationService";
import AttachmentsService from "../../services/AttachmentsService";
import { Translate } from "react-translated";
import MyVerticallyCenteredModal from "../Form/ModalContainer/MyVerticallyCenteredModal";
import { errorToast, infoToast, successToast } from "../../common/Toast";
import { Loader } from "../Loader/Loader";

const ACCEPTED = 1;
const REJECTED = 2;
const NEW = 0;
const HEADER_NAME = "Rental Applicants";

export class OwnerApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { eventKey: 1, title: "All Apps", tabIndex: 0 },
        { eventKey: 2, title: "New", tabIndex: 1 },
        { eventKey: 3, title: "Accepted", tabIndex: 2 },
        { eventKey: 4, title: "Rejected", tabIndex: 3 },
      ],
      tableTitles: ["Applicant", "Advert", "Status", "Date", "Actions"],
      activeTab: 1,
      showPop: false,
      selectedItem: null,
      itemToAccept: null,
      accountId: this.props.auth.getAccountId(),
      error: null,
      isLoading: false,
      showClientConfirmationModal: false,
      applications: [],
      listings: [],
      apartments: [],
    };
  }

  async componentDidMount() {
    await this.fetchApplications();
  }

  async fetchApplications() {
    this.setState({ isLoading: true });
    try {
      const organization = await OrganizationService.fetchOrganisation(
        this.state.accountId
      );
      if (organization.data && organization.data.length > 0) {
        const organizationId = organization.data[0].organizationId;
        const properties = await PropertyService.fetchProperties(
          organizationId
        );
        if (properties.data.length > 0) {
          const appartements = await AppartementsService.fetchAppartments(
            properties.data
          );
          if (appartements.data.length > 0) {
            this.setState({ apartments: appartements.data });
            const listings = await ListingsService.fetchListings(
              appartements.data
            );
            if (listings.data.length > 0) {
              this.setState({ listings: listings.data });
              let applications = await ApplicationsService.fetchApplications(
                listings.data
              );
              if (applications.data.length > 0) {
                applications = applications.data;
                let paralelRequestResult = await Promise.all([
                  AccountsService.fetchApplicantsAccountsInfo(applications),
                  ConversationService.fetchConversationsFromApplications(
                    applications
                  ),
                  TenantsService.fetchApplicantsConsent(applications),
                ]);
                let profileInformations = paralelRequestResult[0].data;
                let conversations = paralelRequestResult[1].data;
                let applicantsConstents = paralelRequestResult[2].data;
                let messages = await ConversationService.fetchFirstMessageFromConversation(
                  conversations
                ).then((messages) => messages.map((message) => message.data));
                this.linkFirstMessageToConversation(conversations, messages);
                for (const application of applications) {
                  let listingInfo = this.getListingInfo(
                    listings.data,
                    application
                  );
                  let profileInfo = this.getProfileInformation(
                    profileInformations,
                    application
                  );

                  let conversation = this.getFirstMessage(
                    conversations,
                    application
                  );

                  let applicantConstent = this.getApplicantsConstents(
                    applicantsConstents,
                    application
                  );
                  if (listingInfo) application["listing"] = listingInfo;
                  if (profileInfo) application["applicant"] = profileInfo;
                  if (conversation)
                    application["message"] = conversation["message"];
                  if (applicantConstent)
                    application["constent"] = applicantConstent;
                }
                const attachements = await this.fetchAttachments(applications);
                this.addAttachment(applications, attachements);
                this.setState({ applications: applications });
              }
            }
          }
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      errorToast(<Translate text="Loading data error"></Translate>, 4000);
      this.setState({ error: true, isLoading: false });
    }
  }

  addAttachment = (applications, attachements) => {
    for (let index = 0; index < applications.length; index++) {
      applications[index]["attachements"] = attachements[index];
    }
  };

  fetchAttachments = (applications) => {
    let attachementsRequest = [];
    for (const application of applications) {
      attachementsRequest.push(
        AttachmentsService.fetchAttachmentsById(application)
      );
    }
    return Promise.all(attachementsRequest).then((results) =>
      results.map((result) => result.data)
    );
  };

  linkFirstMessageToConversation = (conversations, messages) => {
    for (const conversation of conversations) {
      const find = messages.find(
        (message) => message.conversationId === conversation.id
      );
      if (find) conversation["message"] = find["text"];
    }
  };

  getListingInfo = (listings, application) => {
    return listings.find((listing) => listing.id === application.listingId);
  };

  getProfileInformation = (profileInformations, application) => {
    return profileInformations.find(
      (profileInformation) => profileInformation.id === application.accountId
    );
  };

  getApplicantsConstents = (applicantsConstents, application) => {
    return applicantsConstents.find(
      (appliquant) => appliquant.accountId == application.accountId
    );
  };

  getFirstMessage = (conversations, application) => {
    return conversations.find(
      (conversation) => conversation.createdById == application.accountId
    );
  };

  handleTabChange = (keyTab) => {
    this.setState({ activeTab: keyTab });
  };

  handleTogglePop = (item) => {
    const show = !this.state.showPop;
    this.setState({ showPop: show, selectedItem: item });
  };

  updateApplicationsStatus = async (application, status) => {
    let { applications } = this.state;
    if (status === ACCEPTED) {
      const otherApplications = applications.filter(
        (app) =>
          app.listingId === application.listingId &&
          app.id !== application.id &&
          app.status === NEW
      );
      if (otherApplications.length > 0) {
        let requests = [];
        requests.push(
          this.updateApplicationRequest(application, { status: ACCEPTED })
        );
        for (const otherApplication of otherApplications) {
          requests.push(
            this.updateApplicationRequest(otherApplication, {
              status: REJECTED,
            })
          );
        }
        Promise.all(requests)
          .then(() => {
            this.addNewTenant(application)
              .then((result) => {
                if (result.status === 200) {
                  for (const otherApplication of otherApplications) {
                    this.updateStateApplicationStatus(
                      applications,
                      otherApplication,
                      REJECTED
                    );
                  }
                  this.updateStateApplicationStatus(
                    applications,
                    application,
                    ACCEPTED
                  );
                  this.setState({
                    applications: applications,
                    isLoading: false,
                  });
                  successToast(<Translate text="Done"></Translate>, 1000);
                }
              })
              .catch(() =>
                errorToast(
                  <Translate text="Try again message"></Translate>,
                  3000
                )
              );
          })
          .catch(() =>
            errorToast(<Translate text="Try again message"></Translate>, 3000)
          );
      } else {
        try {
          const result = await this.updateApplicationRequest(application, {
            status: ACCEPTED,
          }).then(() => this.addNewTenant(application));
          if (result.status === 200) {
            this.updateStateApplicationStatus(
              applications,
              application,
              ACCEPTED
            );
            this.setState({
              applications: applications,
              isLoading: false,
            });
            successToast(<Translate text="Done"></Translate>, 1000);
          }
        } catch (error) {
          errorToast(<Translate text="Try again message"></Translate>, 3000);
        }
      }
    } else {
      try {
        const result = await this.updateApplicationRequest(application, {
          status: REJECTED,
        });
        if (result.status === 200) {
          this.updateStateApplicationStatus(
            applications,
            application,
            REJECTED
          );
          this.setState({
            applications: applications,
            isLoading: false,
          });
          successToast(<Translate text="Done"></Translate>, 1000);
        }
      } catch (error) {
        errorToast(<Translate text="Try again message"></Translate>, 3000);
      }
    }
  };

  updateStateApplicationStatus = (applications, application, status) => {
    applications[
      this.findApplicationIndex(applications, application)
    ].status = status;
  };

  findApplicationIndex = (applications, application) => {
    return applications.findIndex((app) => app.id === application.id);
  };

  updateApplicationRequest = async (application, status) => {
    const modifiedApplication = {
      id: application["id"],
      accountId: application["accountId"],
      listingId: application["listingId"],
      status: status["status"],
      consentForCreditCheck: application["consentForCreditCheck"],
      wantsRentalInsurance: application["wantsRentalInsurance"],
      applicationDate: application["applicationDate"],
    };
    return await ApplicationsService.modifyApplications(modifiedApplication);
  };

  addNewTenant = async (application) => {
    const listing = this.state.listings.find(
      (listing) => listing.id === application.listingId
    );
    if (listing) {
      const appartement = this.state.apartments.find(
        (appartement) => appartement.id === listing.apartmentId
      );
      if (appartement) {
        if (application.consentForCreditCheck) {
          return await AppartementsService.modifyAppartment(
            Object.assign(appartement, { tenantId: application.constent.id })
          ).then(() =>
            TenantsService.modifyTenant(
              Object.assign(application.constent, {
                activeLease: true,
              })
            )
          );
        } else {
          const newTenant = {
            accountId: application.accountId,
            creditScore: 0,
            rentalInsuranceNumber: "",
            activeLease: true,
          };
          return await TenantsService.postTenant(newTenant).then((result) =>
            AppartementsService.modifyAppartment(
              Object.assign(appartement, {
                tenantId: result.data,
              })
            )
          );
        }
      }
    }
  };

  onClickHandler = (e, item) => {
    switch (e) {
      case "accept":
        this.showConfirmationPopUp(item);
        break;
      case "reject":
        this.updateApplicationsStatus(item, REJECTED);
        break;
      case "apply":
        infoToast(<Translate text="Future feature"></Translate>, 2000);
        break;
      case "chat":
        this.chatHandler(item);
      default:
        break;
    }
  };

  showConfirmationPopUp = (item) => {
    this.setState({
      itemToAccept: item,
      showClientConfirmationModal: !this.state.showClientConfirmationModal,
    });
  };

  chatHandler = (item) => {
    this.props.history.push({
      pathname: "/chat",
      state: { participantId: item.applicant.id },
    });
  };

  render() {
    let AcceptDropDown = (props) => {
      return props.status === NEW ? (
        <Dropdown.Item eventKey="accept">
          <FaThumbsUp />
          <Translate text="Accept action"></Translate>
        </Dropdown.Item>
      ) : null;
    };

    let RejectDropDown = (props) => {
      return props.status === NEW ? (
        <Dropdown.Item eventKey="reject">
          <FaThumbsDown />
          <Translate text="Reject action"></Translate>
        </Dropdown.Item>
      ) : null;
    };

    let ApplyForCreditCheckDropDown = (props) => {
      return props.consentForCreditCheck && props.status === NEW ? (
        <Dropdown.Item eventKey="apply">
          <FaFileAlt />
          <Translate text="Credit check action"></Translate>
        </Dropdown.Item>
      ) : null;
    };
    let RowsTable = (props) => {
      let list = props.list;
      return list.map((item) => (
        <tr
          key={item.id}
          className="rowBody"
          onClick={() => this.handleTogglePop(item)}
        >
          <th scope="row">
            <div className="applicantContainer">
              <div className="imageContainer">
                <img
                  className="img"
                  width="100"
                  height="100"
                  src={image}
                  alt="profileImage"
                />
              </div>
              <div className="applicant-name">
                {item.applicant.firstName} {item.applicant.lastName}
              </div>
            </div>
          </th>
          <td>{item.listing.titre}</td>
          <td>
            <StatusIndicator
              status={item.status}
              firstFlag={ACCEPTED}
              secondFlag={REJECTED}
            />
          </td>
          <td>{moment(item.applicationDate).format("YYYY-MM-DD")}</td>
          <td>
            <DropdownButton
              size="sm"
              variant="light"
              menuAlign="right"
              title={<FaEllipsisV />}
              id="dropdown-menu-align-right"
              onSelect={(event) => {
                this.onClickHandler(event, item);
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <AcceptDropDown status={item.status} />
              <RejectDropDown status={item.status} />
              <ApplyForCreditCheckDropDown
                consentForCreditCheck={item.consentForCreditCheck}
                status={item.status}
              />
              <Dropdown.Item eventKey="chat">
                <FaComments />
                <Translate text="Chat action"></Translate>
              </Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      ));
    };

    const mapItemStatus = {
      Accepted: 1,
      Rejected: 2,
      New: 0,
    };

    let Table = (props) => {
      let filter = mapItemStatus[props.filter];
      let list =
        filter || filter === 0
          ? applications.filter((item) => {
              return item.status === filter;
            })
          : applications;
      return list.length > 0 ? (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <table className="table table-responsive-lg">
                <HeadTable tableTitles={this.state.tableTitles} />
                <tbody>
                  <RowsTable list={list} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="noData">
            <NoData height="300" width="300" />
          </div>
        </div>
      );
    };

    const { error, isLoading, applications } = this.state;
    if (error || !applications) {
      return (
        <div>
          <ToastContainer />
        </div>
      );
    } else if (isLoading) {
      return (
        <div>
          <PageHeader headerName={HEADER_NAME} />
          <div>
            <Loader size="medium" />
          </div>
        </div>
      );
    } else if (applications && applications.length > 0) {
      const PageContent = (props) => {
        return (
          <div>
            <PageHeader headerName={HEADER_NAME} />
            <div>
              <Tabs
                id="controlled-tab-example"
                defaultActiveKey={this.state.activeTab}
                onSelect={this.handleTabChange}
                className="listItemsnav"
              >
                {this.state.tabs.map((item) => {
                  return (
                    <Tab
                      eventKey={item.eventKey}
                      title={<Translate text={item.title}></Translate>}
                      key={item.title}
                    >
                      <Table filter={item.title} />
                    </Tab>
                  );
                })}
              </Tabs>
            </div>
            {this.state.showPop ? (
              <OwnerApplication
                show={this.state.showPop}
                item={this.state.selectedItem}
                onHide={() => this.handleTogglePop(null)}
              />
            ) : null}
            <MyVerticallyCenteredModal
              show={this.state.showClientConfirmationModal}
              onHide={() =>
                this.setState({ showClientConfirmationModal: false })
              }
            >
              <span>
                <Translate text="Accept Application Confirmation"></Translate>
              </span>
              <div className="delete-modal">
                <Button
                  onClick={() => {
                    this.updateApplicationsStatus(
                      this.state.itemToAccept,
                      ACCEPTED
                    );
                    this.setState({ showClientConfirmationModal: false });
                  }}
                >
                  <Translate text="Accept"></Translate>
                </Button>
                <Button
                  onClick={() =>
                    this.setState({ showClientConfirmationModal: false })
                  }
                >
                  Cancel
                </Button>
              </div>
            </MyVerticallyCenteredModal>
            <ToastContainer />
          </div>
        );
      };
      const errorMessage = "Oops! Something went wrong! You can retry";
      return <PageContent errorMessage={errorMessage} />;
    } else {
      return (
        <div>
          <PageHeader headerName={HEADER_NAME} />
          <div className="noContent">
            <NoApplicants height="300" width="300" />
            <div>
              <Translate text="No Applicants"></Translate>
            </div>
          </div>
        </div>
      );
    }
  }
}
