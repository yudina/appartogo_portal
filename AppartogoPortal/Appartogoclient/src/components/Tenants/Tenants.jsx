import React, { Component } from "react";
import image from "../../assets/profileImage.jpg";
import {} from "react-icons/fa";
import { Tabs, Tab } from "react-bootstrap";
import { FaComments } from "react-icons/fa";
import { ReactComponent as NoTenants } from "../../assets/noTenants.svg";
import { ReactComponent as NoData } from "../../assets/noData.svg";
import HeadTable from "../../common/Table/HeadTable";
import PageHeader from "../../common/PageHeader";
import StatusIndicator from "../../common/Table/StatusIndicator";
import PropertyService from "../../services/PropertyService";
import ListingsService from "../../services/ListingsService";
import TenantsService from "../../services/TenantsService";
import AccountsService from "../../services/AccountsService";
import AppartementsService from "../../services/AppartementsService";
import OrganizationService from "../../services/OrganizationService";
import { Translate } from "react-translated";
import { ToastContainer } from "react-toastify";
import { errorToast } from "../../common/Toast";
import { Loader } from "../Loader/Loader";

const ACTIVE = "Active";
const INACTIVE = "Inactive";
const HEADER_NAME = "My Tenants";

class Tenants extends Component {
  constructor(props) {
    super(props);

    // this.props.auth.getAccountId();

    this.state = {
      tabsHeader: [
        { eventKey: 1, title: "All tenants", tabIndex: 0 },
        { eventKey: 2, title: "Active", tabIndex: 1 },
        { eventKey: 3, title: "Inactive", tabIndex: 2 },
      ],
      tableTitles: [
        "Tenant",
        "Housing",
        "Phone Number",
        "Email Address",
        "Insurance number",
        "Credit score",
        "Lease",
        "Actions",
      ],
      activeTab: 1,
      accountId: this.props.auth.getAccountId(),
      error: null,
      isLoading: false,
      tenants: [],
    };
  }

  async componentDidMount() {
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
            const listings = await ListingsService.fetchListings(
              appartements.data
            );
            if (listings.data.length > 0) {
              const tenants = await TenantsService.fetchTenants(
                appartements.data
              );
              if (tenants.data.length > 0) {
                const tenantsPersonalInfos = await AccountsService.fetchTenantsAccountsInfo(
                  tenants.data
                );
                this.setState({
                  tenants: this.getTenantsContent(
                    appartements.data,
                    listings.data,
                    tenants.data,
                    tenantsPersonalInfos.data
                  ),
                });
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

  getTenantsContent = (appartements, listings, tenants, personalInfos) => {
    for (const appartement of appartements) {
      const find = listings.find(
        (listing) => listing.apartmentId === appartement.id
      );
      if (find) appartement["listingName"] = find.titre;
    }
    for (const tenant of tenants) {
      const find = appartements.find(
        (appartement) => appartement.tenantId === tenant.id
      );
      if (find) tenant["appartementName"] = find["listingName"];
      const find2 = personalInfos.find(
        (personalInfo) => personalInfo.id === tenant.accountId
      );
      if (find2) tenant["tenantInfo"] = find2;
    }
    return tenants;
  };

  render() {
    let RowsTable = (props) => {
      let list = props.list;
      return list.map((item) => (
        <tr key={item.id} className="rowBody">
          <th scope="row">
            <div className="applicantContainer">
              <div className="imageContainer">
                <img
                  className="img"
                  width="100"
                  height="100"
                  src={
                    item.tenantInfo.profilePictureUrl
                      ? item.tenantInfo.profilePictureUrl
                      : image
                  }
                  alt="profileImage"
                />
              </div>
              <div className="applicant-name">
                {item.tenantInfo.firstName} {item.tenantInfo.lastName}
              </div>
            </div>
          </th>
          <td>{item.appartementName}</td>
          <td>{item.tenantInfo.phoneNumber}</td>
          <td>{item.tenantInfo.email}</td>
          <td>
            {item.rentalInsuranceNumber
              ? item.rentalInsuranceNumber
              : "0000000"}
          </td>
          <td>{item.creditScore ? item.creditScore : 0}</td>
          <td>
            <StatusIndicator
              status={item.activeLease ? ACTIVE : INACTIVE}
              firstFlag={ACTIVE}
              secondFlag={INACTIVE}
            />
          </td>
          <td>
            <div className="actionButtons">
              <button
                className="actionButton"
                className="btn btn-light"
                variant="light"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push({
                    pathname: "/chat",
                    state: { participantId: item.tenantInfo.id },
                  });
                }}
              >
                <FaComments />
              </button>
            </div>
          </td>
        </tr>
      ));
    };

    const mapItemLease = {
      Active: true,
      Inactive: false,
    };

    let Table = (props) => {
      let lease = mapItemLease[props.lease];
      let list =
        lease || lease === false
          ? tenants.filter((item) => {
              return item.activeLease === lease;
            })
          : tenants;
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

    const { error, isLoading, tenants } = this.state;
    if (error) {
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
    } else if (tenants && tenants.length > 0) {
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
              {this.state.tabsHeader.map((item) => {
                const title =
                  item.title === "All tenants"
                    ? item.title
                    : `${item.title} lease`;
                return (
                  <Tab
                    eventKey={item.eventKey}
                    title={<Translate text={title}></Translate>}
                    key={item.title}
                    className={
                      this.state.activeTab === item.eventKey
                        ? ".activeTab"
                        : null
                    }
                  >
                    <Table lease={item.title} />
                  </Tab>
                );
              })}
            </Tabs>
          </div>
          <ToastContainer />
        </div>
      );
    } else {
      return (
        <div>
          <PageHeader headerName={HEADER_NAME} />
          <div className="noContent">
            <NoTenants height="300" width="300" />
            <div>
              <Translate text="No tenants"></Translate>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Tenants;
