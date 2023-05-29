import React, { useCallback, useContext } from 'react';
import { useQueryClient } from 'react-query';

import { AlertContext } from '../../../context/AlertContext';
import justChooseApi from '../../../services/justChooseApi';
import contentTypesUtility from '../../../utils/contentTypes';
import NoContent from '../NoContent';
import InfinityLoadContentGrid from '../../../components/InfinityLoadContentGrid';
import Result from '../Result';
import useQuery from '../../../hooks/useQuery';
import useInfiniteQuery from '../../../hooks/useInfiniteQuery';

const ContentGrid = ({ poll, authentication, params, contentType }) => {
  const { id: pollId, is_active: isPollActive } = poll;

  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);

  const queryClient = useQueryClient();

  const { data: vote } = useQuery(
    ['showPoll/vote', { pollId, authentication }],
    async () => {
      const response = await justChooseApi.get(`/polls/${pollId}/votes`);
      return response.data;
    },
    { retry: false, enabled: !!authentication }
  );

  const getPollContent = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get(`/polls/${pollId}/content`, {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    [pollId, params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(
      ['showPoll/getPollContent', { pollId, params, authentication }],
      getPollContent,
      {
        getNextPageParam: (lastPage, pages) => {
          return lastPage.page < lastPage.total_pages
            ? pages.length + 1
            : undefined;
        },
      }
    );

  const handleVote = async (e, content) => {
    e.preventDefault();
    if (!authentication) {
      clearTimeout(alertTimeout);
      setMessage('Faça login para poder votar.');
      setSeverity('info');
      setShowAlert(true);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      return;
    }
    if (authentication?.profile?.is_active === false) {
      clearTimeout(alertTimeout);
      setMessage('Confirme seu e-mail para poder votar.');
      setSeverity('info');
      setShowAlert(true);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      return;
    }
    try {
      if (vote) {
        await justChooseApi.delete(`/polls/${pollId}/votes`);
      }

      if (
        vote?.content_id === content.content_id &&
        vote?.type === content.type
      ) {
        queryClient.setQueryData(
          ['showPoll/vote', { pollId, authentication }],
          ''
        );
        return;
      }

      await justChooseApi.post(`/polls/${pollId}/votes`, {
        contentId: content.content_id,
        type: content.type,
      });
      queryClient.setQueryData(
        ['showPoll/vote', { pollId, authentication }],
        content
      );
    } catch (error) {}
  };

  return (
    <>
      {isPollActive && data?.pages[0]?.total_results === 0 && (
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
      {isPollActive && (
        <InfinityLoadContentGrid
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          data={data}
          lastElementRef={lastElementRef}
          checkbox
          checkboxcheck={(c) =>
            vote?.content_id === c.content_id && vote?.type === c.type
          }
          checkboxclick={handleVote}
          tabIndex="-1"
        />
      )}
      {!isPollActive && <Result data={data} lastElementRef={lastElementRef} />}
    </>
  );
};

export default ContentGrid;
