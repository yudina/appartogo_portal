import React from "react";
import PropTypes from "prop-types";
import { Input, InputGroup, Button, InputGroupAddon } from "reactstrap";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Translator } from "react-translated";

export class CustomSearch extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onSearch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onSearch(this.state.value);
    }
  }

  render() {
    return (
      <InputGroup className={this.props.className} size="sm">
        <InputGroupAddon addonType="prepend"></InputGroupAddon>

        <Translator>
          {({ translate }) => (
            <Input
              onChange={(e) => {
                this.setState({ value: e.target.value });
              }}
              value={this.state.value}
              className="bg-white"
              placeholder={translate({
                text: "Type to search...",
              })}
            />
          )}
        </Translator>
        {this.state.value && (
          <InputGroupAddon addonType="append">
            <Button
              outline
              onClick={() => {
                this.setState({ value: "" });
              }}
            >
              <i>
                <FontAwesomeIcon icon={faTimes} className="fa-fw" />
              </i>
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
    );
  }
}
