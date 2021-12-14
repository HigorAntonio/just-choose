import React from 'react';

import UserProfileStartResults from '../UserProfileStartResults';

import { Container } from './styles';

const UserProfileStart = () => {
  return (
    <Container>
      <UserProfileStartResults title="Listas" />
      <UserProfileStartResults title="Votações" />
      <UserProfileStartResults title="Votos" />
    </Container>
  );
};

export default UserProfileStart;
