import React from 'react';

import { Container, Logo } from './styles';

const SearchNotFound = () => {
  return (
    <Container>
      <Logo />
      <h3>Nenhum resultado encontrado</h3>
      <p>
        Use palavras-chave diferentes ou navegue entre os filtros de conteúdo.
      </p>
    </Container>
  );
};

export default SearchNotFound;
