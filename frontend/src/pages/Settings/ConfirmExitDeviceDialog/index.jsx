import React from 'react';

import InputToggleVisibility from '../../../components/InputToggleVisibility';

import { Container, Header, Main } from './styles';

const ConfirmExitDeviceDialog = ({
  deviceOS,
  password,
  setPassword,
  handleConfirm,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      handleConfirm();
    }
  };

  return (
    <Container>
      <Header>
        <h1>Sair do {deviceOS}?</h1>
      </Header>
      <Main>
        <div>
          Não será possível acessar a conta do JustChoose nesse dispositivo.
        </div>
        <div>Por favor digite sua senha para confirmar.</div>
        <InputToggleVisibility
          label="Senha"
          id="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleConfirm} disabled={!password}>
          Sim, quero sair do dispositivo
        </button>
      </Main>
    </Container>
  );
};

export default ConfirmExitDeviceDialog;
