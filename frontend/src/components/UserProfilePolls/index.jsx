import React from 'react';

import UserProfileContentCard from '../UserProfileContentCard';
import UserProfileGrid from '../UserProfileGrid';

import { Container } from './styles';

const UserProfilePolls = () => {
  return (
    <Container>
      <UserProfileGrid minWidth="29rem" gridGap="1rem">
        {[...Array(30).keys()].map((c) => (
          <UserProfileContentCard key={c} />
        ))}
      </UserProfileGrid>
    </Container>
  );
};

export default UserProfilePolls;
