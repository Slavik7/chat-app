import React, { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import { newMsg } from "../api";
const InputMsg = ({ chatId, token }) => {
  const [text, setText] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const textSubmitHandler = async (e) => {
    e.preventDefault();
    if (text.length > 0) {
      setIsSubmiting(true);
      await axios
        .post(
          newMsg(),
          { id: chatId, content: text },
          {
            headers: { "x-auth-token": token },
          }
        )
        .then(() => {
          setText("");
        });
      setIsSubmiting(false);
    }
  };
  return (
    <InputMsgStyled>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      ></input>
      <IconButton
        className="btn-send"
        size="small"
        type="submit"
        onClick={textSubmitHandler}
        disabled={isSubmiting}
      >
        <SendIcon />
      </IconButton>
    </InputMsgStyled>
  );
};

export default InputMsg;

const InputMsgStyled = styled.form`
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-top: 0.2rem;
  height: 5%;

  input {
    flex: 1;
    font-size: 1.1rem;

    outline-width: 0;
    padding: 0.2em;
    width: 100%;
  }
  .btn-send {
    margin: 0 0.2rem;
  }
`;
