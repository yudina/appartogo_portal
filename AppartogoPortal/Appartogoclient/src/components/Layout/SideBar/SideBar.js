import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faBars,
  faAd,
  faUsers,
  faBuilding,
  faPlusCircle,
  faPoll,
  faHouseUser,
  faProjectDiagram,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import SideBarSubMenu from "./SideBarSubMenu";
import { Nav, Button } from "react-bootstrap";
import classNames from "classnames";
import "./SideBar.css";
import { Link, NavLink } from "react-router-dom";
import { Translate } from "react-translated";

class SideBar extends React.Component {
  render() {
    return (
      <div className={classNames("sidebar", { "is-open": this.props.isOpen })}>
        <div className="sidebar-header">
          <Button
            variant="link"
            onClick={this.props.toggle}
            style={{ color: "#fff" }}
            className="mt-4"
          >
            <FontAwesomeIcon icon={faBars} pull="right" size="xs" />
          </Button>
          <h3>Portal</h3>
        </div>
        <Nav className="flex-column">
          {/* GLOBAL PAGES */}

          {/* OWNER PAGES */}
          <p className="m-3">
            <b>
              <Translate text="Owner" />
            </b>
          </p>
          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/owner-dashboard"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faProjectDiagram} className="mr-3 fa-fw" />
              <Translate text="Dashboard" />
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/applications"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faClipboardCheck} className="mr-3 fa-fw" />
              <Translate text="Rental Applicants" />
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/listings"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faAd} className="mr-3 fa-fw" />
              <Translate text="My Listings" />
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/properties"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faBuilding} className="mr-3 fa-fw" />
              <Translate text="My Properties" />
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/tenants"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-3 fa-fw" />
              <Translate text="My Tenants" />
            </NavLink>
          </Nav.Item>

          {/* <SideBarSubMenu title="Manage" icon={faClipboardList} items={["page1", "page2"]} /> */}
        </Nav>

        {/* TENANT PAGES */}
        <Nav className="flex-column pt-2">
          <p className="m-3">
            <b>
              <Translate text="Tenant" />
            </b>
          </p>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/tenant-dashboard"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faPoll} className="mr-3 fa-fw" />
              <Translate text="Dashboard" />
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/housing"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faHouseUser} className="mr-3 fa-fw" />
              <Translate text="My Housing" />
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/applications-history"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faClipboardCheck} className="mr-3 fa-fw" />
              <Translate text="Applications History" />
            </NavLink>
          </Nav.Item>

          <Nav.Item>
            <NavLink
              className="nav-link"
              to="/apply"
              activeStyle={{
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faHouseUser} className="mr-3 fa-fw" />
              <Translate text="Apply" />
            </NavLink>
          </Nav.Item>
        </Nav>
      </div>
    );
  }
}

export default SideBar;
