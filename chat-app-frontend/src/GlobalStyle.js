import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  *::-webkit-scrollbar {
    width: 4px;
    height: 4px;
   
  }
  *::-webkit-scrollbar-thumb {
    background-color: #6d6d6d3d;
  }
  
  *::-webkit-scrollbar-track {
    background: #fff;
  }
  
  body {
    font-family: "Rubik", sans-serif;
  }
  .app {
    display: grid;
    place-items: center;
    height: 100vh;
    overflow: none;
  }
  
  .app-container {
    width: 80%;
    display: flex;
    height: 80vh;
    box-shadow: 1px 0 20px 1px rgba(85, 85, 85, 0.336);
  }
  `;

export default GlobalStyle;
