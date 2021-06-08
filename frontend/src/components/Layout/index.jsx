import React, { useContext, useRef } from 'react';
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
import CreateList from '../../routes/CreateList';
import ShowList from '../../routes/ShowList';

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
  const bodyWrapperRef = useRef();

  return (
    <Container>
      <Router>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper ref={bodyWrapperRef}>
          <NavBarWrapper>
            <NavBar />
          </NavBarWrapper>
          <ContentWrapper>
            <Switch>
              <CustomRoute
                exact
                path="/"
                component={() => <Home wrapperRef={bodyWrapperRef} />}
              />
              <CustomRoute
                isPrivate
                exact
                path="/list"
                component={() => <CreateList wrapperRef={bodyWrapperRef} />}
              />
              <CustomRoute
                isPrivate
                exact
                path="/list/:id"
                component={() => <ShowList />}
              />
            </Switch>
          </ContentWrapper>
        </BodyWrapper>
      </Router>
    </Container>
  );
};

export default Layout;
