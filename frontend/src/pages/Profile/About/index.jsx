import React from 'react';

import { Container, DescriptionWrapper, Description } from './styles';

const About = ({ profileAbout }) => {
  return (
    <Container>
      {profileAbout && (
        <DescriptionWrapper>
          <h3>Descrição</h3>
          <Description>{profileAbout}</Description>
        </DescriptionWrapper>
      )}
    </Container>
  );
};

export default About;
