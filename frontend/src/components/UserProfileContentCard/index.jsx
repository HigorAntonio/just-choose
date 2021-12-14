import React from 'react';

import { Container, CardWrapper, Top, ThumbWrapper, Bottom } from './styles';

const UserProfileContentCard = () => {
  return (
    <Container>
      <CardWrapper>
        <Top>
          <ThumbWrapper></ThumbWrapper>
        </Top>
        <Bottom></Bottom>
      </CardWrapper>
    </Container>
  );
};

export default UserProfileContentCard;
