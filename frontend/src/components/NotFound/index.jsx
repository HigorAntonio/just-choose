import React from 'react';

import { Container } from './styles';

const NotFound = () => {
  return (
    <Container>
      <h1>Oops! Não encontramos a página que está procurando</h1>
      <p>Você tentou solicitar uma página que não existe.</p>
    </Container>
  );
};

export default NotFound;
