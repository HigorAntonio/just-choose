import React from 'react';

import { Container, Logo } from './styles';

const NotFound = ({ query }) => {
  return (
    <Container>
      <Logo />
      <h3>Nenhum resultado encontrado {query && `para ${query}`}</h3>
      <p>
        Certifique-se de que todas as palavras estão corretamente escritas ou
        tente palavras-chave diferentes.
      </p>
    </Container>
  );
};

export default NotFound;
