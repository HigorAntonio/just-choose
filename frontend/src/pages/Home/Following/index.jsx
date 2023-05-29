import React from 'react';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
import FollowingPolls from '../FollowingPolls';
import FollowingLists from '../FollowingLists';

import { Container, LineWrapper, Line } from './styles';

const Following = () => {
  const { isFetching, error, data } = useQuery(
    ['home/following'],
    async () => {
      const response = await justChooseApi.get('/following');
      return response.data;
    },
    { retry: false }
  );

  return (
    <Container>
      {data?.results?.polls?.results?.length > 0 && (
        <>
          <FollowingPolls content={data.results.polls.results} />
          <LineWrapper>
            <Line />
          </LineWrapper>
        </>
      )}
      {data?.results?.content_lists?.results?.length > 0 && (
        <>
          <FollowingLists content={data.results.content_lists.results} />
          <LineWrapper>
            <Line />
          </LineWrapper>
        </>
      )}
    </Container>
  );
};

export default Following;
