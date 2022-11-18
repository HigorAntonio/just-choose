import React, { useState, useCallback } from 'react';

import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import justChooseApi from '../../../services/justChooseApi';

import NotFound from '../NotFound';
import ContentListCard from '../ContentListCard';

import { Container, Header, Title, Main } from './styles';

const InfinityLoadContentLists = ({ query }) => {
  const [params] = useState({ query, page_size: 30, type: 'content_list' });

  const getLists = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get('/search', {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    [params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(['search/lists/getLists', params], getLists, {
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
          <Title>Listas</Title>
        </Header>
        <Main>
          {data?.pages.map((page) => {
            return page.results.map((contentList, i) =>
              page.results.length === i + 1 ? (
                <div key={`contentList${contentList.id}`} ref={lastElementRef}>
                  <ContentListCard contentList={contentList} />
                </div>
              ) : (
                <div key={`contentList${contentList.id}`}>
                  <ContentListCard contentList={contentList} />
                </div>
              )
            );
          })}
        </Main>
      </Container>
    </>
  );
};

export default InfinityLoadContentLists;
