import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    color: var(--white);
  }
  html, body, #root {
    max-height: 100vh;
    max-width: 100vw;

    width: 100%;
    height: 100%;
  }
  *, button, input {
    border: 0;
    background: none;
    font-family: 'Roboto', sans-serif;
  }
  html {
    background: var(--secondary);
  }
  :root {
    --primary: #001D38;
    --secondary: #001425;
    --accent: #0F6BA8;
    --search: #35495B;
    --search-button: #213D55;
    --white: #FFFFFF;
    --gray: #C4C4C4;
    --black: #000000;
  }
`;