import React, { useState } from "react";
import styled from "styled-components";
const Toggle = ({ flexDir = "", children }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <ToggleStyled>
      <div className={flexDir}>
        <div onClick={() => setToggle(!toggle)}>{children[0]}</div>
        {toggle ? children[1] : ""}
      </div>
    </ToggleStyled>
  );
};

const ToggleStyled = styled.div`
  .row-reverse {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
  }
  .row {
    display: flex;
  }
  .column-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
export default Toggle;
