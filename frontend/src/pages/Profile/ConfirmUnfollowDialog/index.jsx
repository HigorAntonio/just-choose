import React, { useState, useEffect } from 'react';

import {
  Container,
  Header,
  Main,
  ButtonsWrapper,
  CancelButton,
  ConfirmButton,
} from './styles';

const ConfirmUnfollowDialog = ({
  profileDisplayName,
  handleConfirm,
  handleCancel,
}) => {
  return (
    <Container>
      <Header>
        <h1>Deixar de seguir {profileDisplayName}?</h1>
      </Header>
      <Main>
        <div>
          Você não irá mais receber notificações desse perfil ou vê-lo/a na
          lista dos perfis que segue.
        </div>

        <ButtonsWrapper>
          <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
          <ConfirmButton onClick={handleConfirm}>
            Sim, quero deixar de seguir
          </ConfirmButton>
        </ButtonsWrapper>
      </Main>
    </Container>
  );
};

export default ConfirmUnfollowDialog;
