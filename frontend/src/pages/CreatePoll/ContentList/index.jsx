import React, { useCallback } from 'react';

import justChooseApi from '../../../services/justChooseApi';
import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import InfinityLoadContentGrid from '../../../components/InfinityLoadContentGrid';

const ContentList = ({ listId }) => {
  const getContentListContent = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get(
        `/contentlists/${listId}/content`,
        {
          params: { page: pageParam },
        }
      );
      return response.data;
    },
    [listId]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(
      ['createPoll/contentList/content', listId],
      getContentListContent,
      {
        getNextPageParam: (lastPage, pages) => {
          return lastPage.page < lastPage.total_pages
            ? pages.length + 1
            : undefined;
        },
      }
    );

  return (
    <InfinityLoadContentGrid
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      data={data}
      lastElementRef={lastElementRef}
      tabIndex="-1"
    />
  );
};

export default ContentList;
