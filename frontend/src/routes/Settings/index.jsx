import React, { useState, useEffect } from 'react';

import SettingsProfile from '../../components/SettingsProfile';
import SettingsSecurity from '../../components/SettingsSecurity';

import { Container, Header, Navigation, Main } from './styles';

const Settings = ({ wrapperRef }) => {
  const [navOption, setNavOption] = useState('profile');

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
          className={navOption === 'profile' ? 'active' : ''}
          onClick={() => setNavOption('profile')}
        >
          <p>Perfil</p>
        </div>
        <div
          className={navOption === 'security' ? 'active' : ''}
          onClick={() => setNavOption('security')}
        >
          <p>Segurança e privacidade</p>
        </div>
        <div
          className={navOption === 'devices' ? 'active' : ''}
          onClick={() => setNavOption('devices')}
        >
          <p>Seus dispositivos</p>
        </div>
      </Navigation>
      <Main>
        {navOption === 'profile' && <SettingsProfile wrapperRef={wrapperRef} />}
        {navOption === 'security' && (
          <SettingsSecurity wrapperRef={wrapperRef} />
        )}
      </Main>
    </Container>
  );
};

export default Settings;
