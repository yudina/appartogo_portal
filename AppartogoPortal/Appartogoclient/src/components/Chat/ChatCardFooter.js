import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { InputGroup, InputGroupAddon, Button, Input } from "reactstrap";

const ChatCardFooter = (props) => {
  const [input, setInput] = useState("");

  const handleOnchange = (e) => {
    setInput(e.currentTarget.value);
  };

  const sendMessge = async (e) => {
    props.sendMesage(input);
    setInput("");
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      props.sendMesage(input);
      setInput("");
    }
  };

  return (
    <React.Fragment>
      <InputGroup>
        {/**
         * <InputGroupAddon addonType="prepend">
          <label htmlFor="file-upload" className="custom-file-upload">
            <FontAwesomeIcon icon={faPaperclip} className="fa-fw" />
          </label>
          <input id="file-upload" type="file" />
        </InputGroupAddon>
         */}
        <Input
          onChange={handleOnchange}
          placeholder={
            props.language === "en"
              ? "Enter Your message..."
              : "Entrer votre message..."
          }
          onKeyDown={handleKeyDown}
          value={input}
        />
        <InputGroupAddon addonType="append">
          <Button
            color="primary"
            tag={Link}
            onClick={sendMessge}
            disabled={input.length < 1}
          >
            <i>
              <FontAwesomeIcon icon={faPaperPlane} className="fa-fw" />
            </i>
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </React.Fragment>
  );
};

export { ChatCardFooter };
