import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEnvelope, faUser, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Button, Nav, Dropdown, DropdownButton } from "react-bootstrap";
import logo from "../../../assets/appartogo_logo.svg";
import "./NavMenu.css";
import { Link, NavLink } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Translate } from "react-translated";
import { transform } from "lodash";
import classNames from "classnames";

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  onClickHandler(e) {
    if (e === "logout") {
      this.props.auth.logout();
    }
  }

  render() {
    //() => this.setState({ active: !this.state.active }) add this to onClick
    return (
      <Navbar bg="light" className="navbar shadow-sm p-3 mb-5 bg-white rounded">
        <Button variant="link" Name={this.state.active && "active"} onClick={this.props.toggle}>
          <FontAwesomeIcon
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "none",
            }}
            icon={faAngleLeft}
          />
        </Button>
        <Navbar.Brand>
          <Link to="/">
            <img
              src={logo}
              height="50"
              className="d-inline-block align-top logobrand"
              alt="Appartogo logo"
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto" navbar>
            <Button variant="light" className="mr-1" onClick={this.props.toggleLanguage}>
              {this.props.language === "en" ? "fr" : "en"}
            </Button>
            <Link to="/chat" style={{ display: "flex" }}>
              <Button variant="light" className="mr-1">
                <FontAwesomeIcon
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  icon={faEnvelope}
                />
              </Button>
            </Link>

            <DropdownButton
              style={{ display: "flex" }}
              size="sm"
              variant="light"
              menuAlign="right"
              title={
                <span style={{ display: "inline-flex" }}>
                  <FontAwesomeIcon icon={faUser} className="mr-2 fa-fw" />
                  <div className="accountText mr-1">
                    <Translate text="Account" />
                  </div>
                </span>
              }
              id="dropdown-menu-align-right"
              onSelect={(e) => this.onClickHandler(e)}
            >
              <LinkContainer to="/profile">
                <Dropdown.Item eventKey="1">
                  <Translate text="Account settings" />
                </Dropdown.Item>
              </LinkContainer>

              <Dropdown.Divider />
              <Dropdown.Item eventKey="logout">
                <Translate text="Logout" />
              </Dropdown.Item>
            </DropdownButton>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavMenu;
