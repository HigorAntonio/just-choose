import React from 'react';

import { Container, Poster } from './styles';

const ContentCard = (props) => {
  return (
    <Container>
      <Poster src={props.src} />
    </Container>
  );
};

export default ContentCard;
