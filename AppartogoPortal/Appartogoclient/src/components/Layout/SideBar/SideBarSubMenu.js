import React from "react";
import { Accordion, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { Link } from "react-router-dom";

class SideBarSubMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const { icon, title, items } = this.props;

    return (
      <Nav.Item className={classNames({ open: !this.state.collapsed })}>
        <Accordion>
          <Accordion.Toggle as={Nav.Link} variant="link" eventKey="0" onClick={this.toggleNavbar}>
            <FontAwesomeIcon icon={icon} className="mr-3 fa-fw" />
            {title}
            <FontAwesomeIcon
              icon={this.state.collapsed ? faCaretDown : faCaretUp}
              className="float-right"
            />
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0">
            <nav className="nav flex-column">
              {items.map((item) => (
                <Link
                  className={`nav-link nav-item pl-5 ${item === "Active" ? "active" : ""} `}
                  to="/"
                  key={item}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </Accordion.Collapse>
        </Accordion>
      </Nav.Item>
    );
  }
}

export default SideBarSubMenu;
