import React from 'react';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
import TrendingLists from '../TrendingLists';

import { Container, LineWrapper, Line } from './styles';

const Trending = () => {
  const { isFetching, error, data } = useQuery(
    ['home/trending'],
    async () => {
      const response = await justChooseApi.get('/trending');
      return response.data;
    },
    { retry: false }
  );

  return (
    <Container>
      {data?.results?.content_lists?.results?.length > 0 && (
        <>
          <TrendingLists content={data.results.content_lists.results} />
          <LineWrapper>
            <Line />
          </LineWrapper>
        </>
      )}
    </Container>
  );
};

export default Trending;
