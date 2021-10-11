import React, { useState } from 'react';

import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';

import SearchNotFound from '../SearchNotFound';
import SearchProfileCard from '../SearchProfileCard';

import { Container, Header, Title, Main } from './styles';

const SearchInfinityLoadProfiles = ({ query }) => {
  const [params] = useState({ query });

  const { loading, error, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/users', params);

  return (
    <>
      {!loading && content.length === 0 && <SearchNotFound query={query} />}
      {!error && content.length > 0 && (
        <Container>
          <Header>
            <Title>Perfis</Title>
          </Header>
          <Main>
            {content.map((profile, i) =>
              content.length === i + 1 ? (
                <div key={`profile${profile.id}`} ref={lastElementRef}>
                  <SearchProfileCard profile={profile} />
                </div>
              ) : (
                <div key={`profile${profile.id}`}>
                  <SearchProfileCard profile={profile} />
                </div>
              )
            )}
          </Main>
        </Container>
      )}
    </>
  );
};

export default SearchInfinityLoadProfiles;
