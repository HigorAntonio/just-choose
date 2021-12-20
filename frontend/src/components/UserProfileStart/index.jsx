import React from 'react';

import UserProfileStartResults from '../UserProfileStartResults';
import UserProfileListCard from '../UserProfileListCard';
import UserProfilePollCard from '../UserProfilePollCard';

import { Container } from './styles';

const UserProfileStart = () => {
  return (
    <Container>
      <UserProfileStartResults title="Listas">
        <UserProfileListCard
          contentList={{
            id: 1,
            thumbnail:
              'http://localhost:3333/files/06f301969844b23c331f71b8d2741784-black_mirror.jpg',
            title: 'JINGLE ALL THE WAY | Siga @patriota nas redes',
            likes: 342,
            forks: 138,
            updated_at: '2021-12-18T19:52:06.234Z',
          }}
        />
      </UserProfileStartResults>
      <UserProfileStartResults title="Votações">
        <UserProfilePollCard
          poll={{
            id: 1,
            thumbnail:
              'http://localhost:3333/files/92024286d8505464992c35b468f3f2cc-BobaFett.jpg',
            title:
              'Web App Vulnerabilities - DevSecOps Course for Beginners freeCodeCamp.org',
            is_active: true,
            updated_at: '2021-11-29T19:52:06.234Z',
          }}
        />
      </UserProfileStartResults>
      <UserProfileStartResults title="Votos">
        <UserProfilePollCard
          poll={{
            id: 1,
            thumbnail:
              'http://localhost:3333/files/070408768981a7a4e80a4865b51891b4-acer_nitro_5.jpeg',
            title:
              'Web App Vulnerabilities - DevSecOps Course for Beginners freeCodeCamp.org',
            is_active: true,
            updated_at: '2021-11-29T19:52:06.234Z',
          }}
        />
      </UserProfileStartResults>
    </Container>
  );
};

export default UserProfileStart;
