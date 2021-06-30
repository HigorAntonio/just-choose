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
    background: var(--background-400);
  }
  :root {
    --primary: lightgray;
    --secondary: #001425;
    --accent: ${(props) => props.theme.colors.primary};
    --search: #35495B;
    --search-button: #213D55;
    --header-border: #001425;
    --nav-bar: #061F34;

    --white: #ffffff;
    --black: #000000;
    --gray: #C4C4C4;
    --dark-gray: #888888;
    --error: #eb0400;
    --success: #43a047;

    --primary-400: ${(props) => props.theme.colors['primary-400']};
    --primary-500: ${(props) => props.theme.colors['primary-500']};

    --background-100: ${(props) => props.theme.colors['background-100']};
    --background-300: ${(props) => props.theme.colors['background-300']};
    --background-400: ${(props) => props.theme.colors['background-400']};
    --background-500: ${(props) => props.theme.colors['background-500']};
    --background-600: ${(props) => props.theme.colors['background-600']};
    --background-700: ${(props) => props.theme.colors['background-700']};
    --background-900: ${(props) => props.theme.colors['background-900']};

    --text: ${(props) => props.theme.colors.text};

    --tooltip: ${(props) => props.theme.colors.tooltip};
    --tooltip-text: ${(props) => props.theme.colors['tooltip-text']};
  }
  /* Scrollbar on Firefox */
  * {
    scrollbar-width: thin;
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
`;
