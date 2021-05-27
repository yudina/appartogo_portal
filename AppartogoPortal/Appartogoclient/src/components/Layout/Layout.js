import React, { Component } from "react";
import SideBar from "./SideBar/SideBar";
import Content from "./Content";

export class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isMobile: true,
      language: "en",
    };

    this.previousWidth = -1;
  }

  // Automatically open or close side bar depending on screen width
  updateWidth() {
    const width = window.innerWidth;
    const widthLimit = 700;
    const isMobile = width <= widthLimit;
    const wasMobile = this.previousWidth <= widthLimit;

    if (isMobile !== wasMobile) {
      this.setState({
        isOpen: !isMobile,
      });
    }

    this.previousWidth = width;
  }

  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth.bind(this));
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleToggleLanguage = () => {
    console.log(this.props.toggleLanguage);
    this.props.toggleLanguage();
  };

  render() {
    return (
      <div>
        <div className="App wrapper">
          <SideBar toggle={this.toggle} isOpen={this.state.isOpen} {...this.props} />
          <Content
            toggle={this.toggle}
            isOpen={this.state.isOpen}
            {...this.props}
            toggleLanguage={this.handleToggleLanguage}
          />
        </div>
      </div>
    );
  }
}
