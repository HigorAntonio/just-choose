import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

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

const CustomRoute = ({ isPrivate, ...rest }) => {
  const { loading, authenticated } = useContext(AuthContext);

  if (loading) return <h1>Loading...</h1>;

  if (isPrivate && !authenticated) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} />;
};

const Layout = () => {
  return (
    <Container>
      <Router>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <NavBarWrapper>
            <NavBar />
          </NavBarWrapper>
          <ContentWrapper>
            <Switch>
              <CustomRoute exact path="/" component={Home} />
              <CustomRoute
                isPrivate
                exact
                path="/list"
                component={CreateMovieList}
              />
            </Switch>
          </ContentWrapper>
        </BodyWrapper>
      </Router>
    </Container>
  );
};

export default Layout;
