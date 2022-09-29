import React, { useEffect, useContext } from 'react';
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom';

import { LayoutContext } from '../../context/LayoutContext';

import HorizontalDragScrolling from '../../components/HorizontalDragScrolling';
import Profile from './Profile';
import Security from './Security';
import Devices from './Devices';
import navOnAuxClick from '../../utils/navOnAuxClick';

import {
  Container,
  StickyWrapper,
  Header,
  NavigationWrapper,
  Navigation,
  Main,
} from './styles';

const Settings = () => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const location = useLocation();

  const { contentWrapperRef } = useContext(LayoutContext);

  useEffect(() => {
    if (
      location.pathname !== `${path}/profile` &&
      location.pathname !== `${path}/security` &&
      location.pathname !== `${path}/devices`
    ) {
      history.replace(`${path}/profile`);
    }
  }, [location, path, history]);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef, location]);

  const handlePush = (path) => {
    history.push(path);
  };

  const handleOnPressEnter = (e, cb, option) => {
    if (e.key === 'Enter') {
      cb(option);
    }
  };

  return (
    <Container>
      <StickyWrapper>
        <Header>
          <h1>Configurações</h1>
        </Header>
        <NavigationWrapper>
          <HorizontalDragScrolling>
            <Navigation>
              <div
                className={
                  location.pathname === `${url}/profile` ? 'active' : ''
                }
                onClick={() => handlePush(`${url}/profile`)}
                onAuxClick={(e) => navOnAuxClick(e, `${url}/profile`)}
                onKeyPress={(e) => {
                  handleOnPressEnter(e, handlePush, `${url}/profile`);
                }}
                tabIndex="0"
              >
                Perfil
              </div>
              <div
                className={
                  location.pathname === `${url}/security` ? 'active' : ''
                }
                onClick={() => handlePush(`${url}/security`)}
                onAuxClick={(e) => navOnAuxClick(e, `${url}/security`)}
                onKeyPress={(e) => {
                  handleOnPressEnter(e, handlePush, `${url}/security`);
                }}
                tabIndex="0"
              >
                Segurança e privacidade
              </div>
              <div
                className={
                  location.pathname === `${url}/devices` ? 'active' : ''
                }
                onClick={() => handlePush(`${url}/devices`)}
                onAuxClick={(e) => navOnAuxClick(e, `${url}/devices`)}
                onKeyPress={(e) => {
                  handleOnPressEnter(e, handlePush, `${url}/devices`);
                }}
                tabIndex="0"
              >
                Seus dispositivos
              </div>
            </Navigation>
          </HorizontalDragScrolling>
        </NavigationWrapper>
      </StickyWrapper>
      <Main>
        {location.pathname === `${path}/profile` && <Profile />}
        {location.pathname === `${path}/security` && <Security />}
        {location.pathname === `${path}/devices` && <Devices />}
      </Main>
    </Container>
  );
};

export default Settings;
