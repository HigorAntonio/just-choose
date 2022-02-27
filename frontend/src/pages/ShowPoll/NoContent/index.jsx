import React from 'react';

import { Container } from './styles';

const NoContent = ({ type }) => {
  return (
    <Container>
      {`Esta votação não apresenta nehum conteúdo${
        type && ` do tipo ${type}`
      }.`}
    </Container>
  );
};

export default NoContent;
