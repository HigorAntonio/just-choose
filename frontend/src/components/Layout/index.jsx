import React, { useContext, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

import Alert from '../Alert';
import Header from '../Header';
import NavBar from '../NavBar';
import Home from '../../routes/Home';
import CreateList from '../../routes/CreateList';
import ShowList from '../../routes/ShowList';
import UpdateList from '../../routes/UpdateList';
import CreatePoll from '../../routes/CreatePoll';
import ShowPoll from '../../routes/ShowPoll';
import UpdatePoll from '../../routes/UpdatePoll';
import NotFound from '../../components/NotFound';

import {
  Container,
  HeaderWrapper,
  BodyWrapper,
  NavBarWrapper,
  ContentWrapper,
} from './styles';

const CustomRoute = ({ isPrivate, ...rest }) => {
  const { loading, authenticated } = useContext(AuthContext);

  if (loading) return null;

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
            <Alert />
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
                path="/lists/:id"
                component={() => <ShowList wrapperRef={bodyWrapperRef} />}
              />
              <CustomRoute
                isPrivate
                exact
                path="/lists/:id/update"
                component={() => <UpdateList wrapperRef={bodyWrapperRef} />}
              />
              <CustomRoute
                isPrivate
                exact
                path="/lists/:id/poll"
                component={() => <CreatePoll wrapperRef={bodyWrapperRef} />}
              />
              <CustomRoute
                isPrivate
                exact
                path="/polls/:id"
                component={() => <ShowPoll wrapperRef={bodyWrapperRef} />}
              />
              <CustomRoute
                isPrivate
                exact
                path="/polls/:id/update"
                component={() => <UpdatePoll wrapperRef={bodyWrapperRef} />}
              />
              <Route component={NotFound} />
            </Switch>
          </ContentWrapper>
        </BodyWrapper>
      </Router>
    </Container>
  );
};

export default Layout;
