import React from 'react';

import UserProfileFollowingCard from '../UserProfileFollowingCard';
import UserProfileGrid from '../UserProfileGrid';

import { Container } from './styles';

const UserProfileFollowing = () => {
  return (
    <Container>
      <UserProfileGrid minWidth="21rem" gridGap="2rem">
        {[...Array(30).keys()].map((c) => (
          <UserProfileFollowingCard
            key={c}
            profile={{
              id: 1,
              thumbnail:
                'http://localhost:3333/files/06f301969844b23c331f71b8d2741784-black_mirror.jpg',
              title: 'JINGLE ALL THE WAY | Siga @patriota nas redes',
              likes: 342,
              forks: 138,
              updated_at: '2021-11-29T19:52:06.234Z',
            }}
          />
        ))}
      </UserProfileGrid>
    </Container>
  );
};

export default UserProfileFollowing;
