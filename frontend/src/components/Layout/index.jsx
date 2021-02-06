import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from '../Header';
import NavBar from '../NavBar';
import Home from '../../routes/Home';
import CreateMovieList from '../../routes/CreateMovieList';

import {
  Container,
  HeaderWrapper,
  BodyWrapper,
  NavBarWrapper,
  ContentWrapper,
} from './styles';

const Layout = () => {
  return (
    <Container>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <NavBarWrapper>
          <NavBar />
        </NavBarWrapper>
        <ContentWrapper>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/movies/list" component={CreateMovieList} />
            </Switch>
          </Router>
        </ContentWrapper>
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
