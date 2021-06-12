import React from 'react';

import { Container } from './styles';

const AccessDenied = () => {
  return (
    <Container>
      <h1>Acesso negado</h1>
      <p>Você tentou solicitar uma página à qual não possui acesso.</p>
    </Container>
  );
};

export default AccessDenied;
