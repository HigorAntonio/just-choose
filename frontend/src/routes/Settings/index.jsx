import React, { useEffect } from 'react';
import {
  Link,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';

import HorizontalDragScrolling from '../../components/HorizontalDragScrolling';
import SettingsProfile from '../../components/SettingsProfile';
import SettingsSecurity from '../../components/SettingsSecurity';

import {
  Container,
  Header,
  NavigationWrapper,
  Navigation,
  Main,
} from './styles';

const Settings = ({ wrapperRef }) => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const location = useLocation();

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
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

  const handlePush = (path) => {
    history.push(path);
  };

  return (
    <Container>
      <Header>
        <h1>Configurações</h1>
      </Header>
      <NavigationWrapper>
        <HorizontalDragScrolling>
          <Navigation>
            <div
              className={location.pathname === `${url}/profile` ? 'active' : ''}
              onClick={() => handlePush(`${url}/profile`)}
            >
              Perfil
            </div>
            <div
              className={
                location.pathname === `${url}/security` ? 'active' : ''
              }
              onClick={() => handlePush(`${url}/security`)}
            >
              Segurança e privacidade
            </div>
            <div
              className={location.pathname === `${url}/devices` ? 'active' : ''}
              onClick={() => handlePush(`${url}/devices`)}
            >
              Seus dispositivos
            </div>
          </Navigation>
        </HorizontalDragScrolling>
      </NavigationWrapper>
      <Main>
        <Switch>
          <Route
            exact
            path={`${path}/profile`}
            component={() => <SettingsProfile wrapperRef={wrapperRef} />}
          />
          <Route
            exact
            path={`${path}/security`}
            component={() => <SettingsSecurity wrapperRef={wrapperRef} />}
          />
          <Route
            exact
            path={`${path}/devices`}
            component={() => <h3>Devices</h3>}
          />
        </Switch>
      </Main>
    </Container>
  );
};

export default Settings;
