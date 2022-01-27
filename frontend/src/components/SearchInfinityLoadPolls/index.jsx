import React, { useState } from 'react';

import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';

import SearchNotFound from '../SearchNotFound';
import SearchPollCard from '../SearchPollCard';

import { Container, Header, Title, Main } from './styles';

const SearchInfinityLoadPolls = ({ query }) => {
  const [params] = useState({ query, page_size: 30, type: 'poll' });

  const { loading, error, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/search', params);

  return (
    <>
      {!loading && content.length === 0 && <SearchNotFound query={query} />}
      {!error && content.length > 0 && (
        <Container>
          <Header>
            <Title>Votações</Title>
          </Header>
          <Main>
            {content.map((poll, i) =>
              content.length === i + 1 ? (
                <div key={`poll${poll.id}`} ref={lastElementRef}>
                  <SearchPollCard poll={poll} />
                </div>
              ) : (
                <div key={`poll${poll.id}`}>
                  <SearchPollCard poll={poll} />
                </div>
              )
            )}
          </Main>
        </Container>
      )}
    </>
  );
};

export default SearchInfinityLoadPolls;
