import React, { useCallback } from 'react';

import justChooseApi from '../../../services/justChooseApi';
import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import NoContent from '../NoContent';
import InfinityLoadContentGrid from '../../../components/InfinityLoadContentGrid';
import contentTypesUtility from '../../../utils/contentTypes';

import { Container } from './styles';

const ContentGrid = ({ listId, params, contentType }) => {
  const getListContent = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get(
        `/contentlists/${listId}/content`,
        {
          params: { ...params, page: pageParam },
        }
      );
      return response.data;
    },
    [listId, params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(
      ['showList/getListContent', listId, params],
      getListContent,
      {
        getNextPageParam: (lastPage, pages) => {
          return lastPage.page < lastPage.total_pages
            ? pages.length + 1
            : undefined;
        },
      }
    );

  return (
    <Container>
      {data?.pages[0]?.total_results === 0 && (
        <NoContent
          type={
            contentType
              ? contentTypesUtility.options
                  .find((e) => e.value === contentType)
                  .key.toLowerCase()
              : ''
          }
        />
      )}
      <InfinityLoadContentGrid
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        data={data}
        lastElementRef={lastElementRef}
      />
    </Container>
  );
};

export default ContentGrid;
