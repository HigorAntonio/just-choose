import React from 'react';

import UserProfilePollCard from '../UserProfilePollCard';
import UserProfileGrid from '../UserProfileGrid';

import { Container } from './styles';

const UserProfilePolls = () => {
  return (
    <Container>
      <UserProfileGrid minWidth="29rem" gridGap="1rem">
        {[...Array(30).keys()].map((c) => (
          <UserProfilePollCard key={c} />
        ))}
      </UserProfileGrid>
    </Container>
  );
};

export default UserProfilePolls;
