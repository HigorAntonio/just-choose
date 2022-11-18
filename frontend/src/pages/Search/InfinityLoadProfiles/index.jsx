import React, { useState, useCallback } from 'react';

import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import justChooseApi from '../../../services/justChooseApi';

import NotFound from '../NotFound';
import ProfileCard from '../ProfileCard';

import { Container, Header, Title, Main } from './styles';

const InfinityLoadProfiles = ({ query }) => {
  const [params] = useState({ query, page_size: 30, type: 'profile' });

  const getProfiles = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get('/search', {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    [params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(['search/profiles/getProfiles', params], getProfiles, {
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
          <Title>Perfis</Title>
        </Header>
        <Main>
          {data?.pages.map((page) => {
            return page.results.map((profile, i) =>
              page.results.length === i + 1 ? (
                <div key={`profile${profile.id}`} ref={lastElementRef}>
                  <ProfileCard profile={profile} />
                </div>
              ) : (
                <div key={`profile${profile.id}`}>
                  <ProfileCard profile={profile} />
                </div>
              )
            );
          })}
        </Main>
      </Container>
    </>
  );
};

export default InfinityLoadProfiles;
