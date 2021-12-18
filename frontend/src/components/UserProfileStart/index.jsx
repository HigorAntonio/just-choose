import React from 'react';

import UserProfileStartResults from '../UserProfileStartResults';
import UserProfileContentCard from '../UserProfileContentCard';
import UserProfilePollCard from '../UserProfilePollCard';

import { Container } from './styles';

const UserProfileStart = () => {
  return (
    <Container>
      <UserProfileStartResults title="Listas">
        <UserProfileContentCard />
      </UserProfileStartResults>
      <UserProfileStartResults title="Votações">
        <UserProfilePollCard />
      </UserProfileStartResults>
      <UserProfileStartResults title="Votos">
        <UserProfilePollCard />
      </UserProfileStartResults>
    </Container>
  );
};

export default UserProfileStart;
