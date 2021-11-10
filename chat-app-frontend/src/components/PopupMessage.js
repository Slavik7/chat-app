import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  closeMsg,
  responseMsgTrue,
  responseMsgFalse,
} from "../actions/popMsgActions";
const PopupMessage = () => {
  const popMessage = useSelector((state) => state.popMessage);
  const dispatch = useDispatch();
  return (
    <PopupMessageStyled pWidth={popMessage.message.length}>
      <div className="message-container">
        <p>{popMessage.message}</p>
        {!popMessage.response ? (
          <button
            className="btn-confirm"
            onClick={() => {
              dispatch(closeMsg());
            }}
          >
            OK
          </button>
        ) : (
          <div className="res-options">
            <button
              className="btn-res res-yes"
              onClick={() => {
                dispatch(responseMsgTrue());
                dispatch(closeMsg());
              }}
            >
              Yes
            </button>
            <button
              className="btn-res res-no"
              onClick={() => {
                dispatch(responseMsgFalse());
                dispatch(closeMsg());
              }}
            >
              No
            </button>
          </div>
        )}
      </div>
    </PopupMessageStyled>
  );
};
export default PopupMessage;

const PopupMessageStyled = styled.div`
  position: absolute;
  background: #00000020;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 999;
  .message-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    width: ${(props) => props.pWidth}ch;
    height: 20%;
    box-shadow: 2px 3px 20px 10px #6d6d6d3d;
    border-radius: 8px;
  }
  p {
    margin-bottom: 1.8rem;
    font-size: 0.9rem;
  }
  .btn-confirm {
    background: #07880724;
    font-family: "Rubik", sans-serif;
    font-weight: 400;
    padding: 0.3em 1.3em;
    border-radius: 0.3rem;
    border: solid 1px #6d6d6d3d;
    cursor: pointer;
    &:hover {
      background: #07880750;
    }
  }
  .btn-res {
    margin: 0 0.5rem;
    width: 6ch;
    padding: 0.2em 0;
    cursor: pointer;
    border-radius: 5px;
    border: solid 1px #6d6d6d3d;
  }
  .res-no {
    background: #ff000058;
    &:hover {
      background: #ff000090;
    }
  }
  .res-yes {
    background: #40ad4058;
    &:hover {
      background: #40ad4090;
    }
  }
`;
