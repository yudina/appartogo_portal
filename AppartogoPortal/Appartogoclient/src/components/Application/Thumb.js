import React from "react";
import PDF from "./PDF";
import styled from "styled-components";

export class Thumb extends React.Component {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) {
      return;
    }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.file);
    });
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) {
      return null;
    }

    if (loading) {
      return <p>loading...</p>;
    }

    return (
      <div>
        {file.type.startsWith("image/") && (
          <img
            src={thumb}
            alt={file.name}
            className="img-thumbnail mt-2"
            height={200}
            width={200}
          />
        )}
        {file.type.startsWith("application/pdf") && <PDF file={file}></PDF>}
      </div>
    );
  }
}
