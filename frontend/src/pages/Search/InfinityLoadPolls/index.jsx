import React, { useState, useCallback } from 'react';

import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import justChooseApi from '../../../services/justChooseApi';

import NotFound from '../NotFound';
import PollCard from '../PollCard';

import { Container, Header, Title, Main } from './styles';

const InfinityLoadPolls = ({ query }) => {
  const [params] = useState({ query, page_size: 30, type: 'poll' });

  const getPolls = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get('/search', {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    [params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(['search/polls/getPolls', params], getPolls, {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.page < lastPage.total_pages
          ? pages.length + 1
          : undefined;
      },
    });

  return (
    <>
      {!isFetching && data?.pages[0]?.total_results === 0 && (
        <NotFound query={query} />
      )}
      <Container>
        <Header>
          <Title>Votações</Title>
        </Header>
        <Main>
          {data?.pages.map((page) => {
            return page.results.map((poll, i) =>
              page.results.length === i + 1 ? (
                <div key={`poll${poll.id}`} ref={lastElementRef}>
                  <PollCard poll={poll} />
                </div>
              ) : (
                <div key={`poll${poll.id}`}>
                  <PollCard poll={poll} />
                </div>
              )
            );
          })}
        </Main>
      </Container>
    </>
  );
};

export default InfinityLoadPolls;
