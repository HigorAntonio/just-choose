import React, { useEffect } from 'react';
import {
  Link,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';

import SettingsProfile from '../../components/SettingsProfile';
import SettingsSecurity from '../../components/SettingsSecurity';

import { Container, Header, Navigation, Main } from './styles';

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

  return (
    <Container>
      <Header>
        <h1>Configurações</h1>
      </Header>
      <Navigation>
        <div
          className={location.pathname === `${path}/profile` ? 'active' : ''}
        >
          <Link to={`${url}/profile`}>Perfil</Link>
        </div>
        <div
          className={location.pathname === `${path}/security` ? 'active' : ''}
        >
          <Link to={`${url}/security`}>Segurança e privacidade</Link>
        </div>
        <div
          className={location.pathname === `${path}/devices` ? 'active' : ''}
        >
          <Link to={`${url}/devices`}>Seus dispositivos</Link>
        </div>
      </Navigation>
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
