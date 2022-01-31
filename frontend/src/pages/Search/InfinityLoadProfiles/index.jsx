import React, { useState } from 'react';

import useLoadMoreWhenLastElementIsOnScreen from '../../../hooks/useLoadMoreWhenLastElementIsOnScreen';

import NotFound from '../NotFound';
import ProfileCard from '../ProfileCard';

import { Container, Header, Title, Main } from './styles';

const InfinityLoadProfiles = ({ query }) => {
  const [params] = useState({ query, page_size: 30, type: 'profile' });

  const { loading, error, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/search', params);

  return (
    <>
      {!loading && content.length === 0 && <NotFound query={query} />}
      {!error && content.length > 0 && (
        <Container>
          <Header>
            <Title>Perfis</Title>
          </Header>
          <Main>
            {content.map((profile, i) =>
              content.length === i + 1 ? (
                <div key={`profile${profile.id}`} ref={lastElementRef}>
                  <ProfileCard profile={profile} />
                </div>
              ) : (
                <div key={`profile${profile.id}`}>
                  <ProfileCard profile={profile} />
                </div>
              )
            )}
          </Main>
        </Container>
      )}
    </>
  );
};

export default InfinityLoadProfiles;
