import React from "react";
import classNames from "classnames";
import { Container } from "react-bootstrap";
import NavMenu from "./NavMenu/NavMenu";

class Content extends React.Component {
  render() {
    return (
      <Container fluid className={classNames("content", { "is-open": this.props.isOpen })}>
        <div className="topbar">
          <NavMenu toggle={this.props.toggle} auth={this.props.auth} {...this.props} />
        </div>
        {this.props.children}
      </Container>
    );
  }
}

export default Content;
