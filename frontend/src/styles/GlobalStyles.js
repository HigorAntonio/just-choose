import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    color: var(--text);
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
    font-size: 62.5%;
    background: var(--background-410);
  }
  body {
    font-size: 1.6rem;

    overflow: hidden;
  }
  :root {
    --white: ${(props) => props.theme.colors.white};
    --black: ${(props) => props.theme.colors.black};
    --gray: ${(props) => props.theme.colors.gray};
    --light-red: ${(props) => props.theme.colors['light-red']};
    --dark-gray: ${(props) => props.theme.colors['dark-gray']};
    --error: ${(props) => props.theme.colors.error};
    --success: ${(props) => props.theme.colors.success};

    --primary-400: ${(props) => props.theme.colors['primary-400']};
    --primary-500: ${(props) => props.theme.colors['primary-500']};

    --background-100: ${(props) => props.theme.colors['background-100']};
    --background-300: ${(props) => props.theme.colors['background-300']};
    --background-400: ${(props) => props.theme.colors['background-400']};
    --background-410: ${(props) => props.theme.colors['background-410']};
    --background-500: ${(props) => props.theme.colors['background-500']};
    --background-510: ${(props) => props.theme.colors['background-510']};
    --background-600: ${(props) => props.theme.colors['background-600']};
    --background-700: ${(props) => props.theme.colors['background-700']};
    --background-900: ${(props) => props.theme.colors['background-900']};

    --text: ${(props) => props.theme.colors.text};

    --tooltip: ${(props) => props.theme.colors.tooltip};
    --tooltip-text: ${(props) => props.theme.colors['tooltip-text']};
  }
  /* Scrollbar on Firefox */
  * {
    scrollbar-width: auto;
    scrollbar-color: var(--dark-gray) var(--background-400);
  }

  /* Scrollbar on Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 12px;
  }

  *::-webkit-scrollbar-track {
    background: var(--background-400);
  }

  *::-webkit-scrollbar-thumb {
    background-color: var(--dark-gray);
    /* border-radius: 20px; */
    border: 3px solid var(--background-400);
  }

  /* Text selection color */
  ::-moz-selection { /* Code for Firefox */
    color: var(--white);
    background: var(--primary-400);
  }

  /* Text selection color */
  ::selection { /* Code for Chrome, Edge, and Safari */
    color: var(--white);
    background: var(--primary-400);
  }
`;
