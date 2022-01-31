import React, { useState } from 'react';

import useLoadMoreWhenLastElementIsOnScreen from '../../../hooks/useLoadMoreWhenLastElementIsOnScreen';

import NotFound from '../NotFound';
import PollCard from '../PollCard';

import { Container, Header, Title, Main } from './styles';

const InfinityLoadPolls = ({ query }) => {
  const [params] = useState({ query, page_size: 30, type: 'poll' });

  const { loading, error, content, lastElementRef } =
    useLoadMoreWhenLastElementIsOnScreen('/search', params);

  return (
    <>
      {!loading && content.length === 0 && <NotFound query={query} />}
      {!error && content.length > 0 && (
        <Container>
          <Header>
            <Title>Votações</Title>
          </Header>
          <Main>
            {content.map((poll, i) =>
              content.length === i + 1 ? (
                <div key={`poll${poll.id}`} ref={lastElementRef}>
                  <PollCard poll={poll} />
                </div>
              ) : (
                <div key={`poll${poll.id}`}>
                  <PollCard poll={poll} />
                </div>
              )
            )}
          </Main>
        </Container>
      )}
    </>
  );
};

export default InfinityLoadPolls;
