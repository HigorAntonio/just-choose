import React, { useContext, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../../context/ThemeContext';

import Alert from '../Alert';
import Header from '../Header';
import NavBar from '../NavBar';
import Routes from '../Routes';
import GlobalStyles from '../../styles/GlobalStyles';

import {
  Container,
  HeaderWrapper,
  BodyWrapper,
  NavBarWrapper,
  ContentWrapper,
} from './styles';

const Layout = () => {
  const { theme } = useContext(ThemeContext);

  const contentWrapperRef = useRef();

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Router>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <NavBarWrapper>
              <NavBar />
            </NavBarWrapper>
            <ContentWrapper ref={contentWrapperRef}>
              <Alert />
              <Routes wrapperRef={contentWrapperRef} />
            </ContentWrapper>
          </BodyWrapper>
        </Router>
      </Container>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
