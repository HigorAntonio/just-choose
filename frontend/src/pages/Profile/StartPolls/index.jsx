import React, { useState, useContext, useEffect } from 'react';

import { ViewportContext } from '../../../context/ViewportContext';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
import PollCard from '../../../components/PollCard';

import {
  Container,
  TitleWrapper,
  Title,
  Main,
  LineWrapper,
  Line,
} from './styles';

const StartPolls = ({ profileToShowId }) => {
  const { width } = useContext(ViewportContext);

  const [lastContentIndex, setLastContentIndex] = useState(0);

  const { isFetching, data } = useQuery(
    ['profile/start/polls', profileToShowId],
    async () => {
      const response = await justChooseApi.get('/polls', {
        params: {
          profile_id: profileToShowId,
          page: 1,
          page_size: 6,
          sort_by: 'updated.desc',
        },
      });
      return response.data;
    },
    { retry: false }
  );

  useEffect(() => {
    if (width < 547) {
      setLastContentIndex(1);
    } else if (width < 938) {
      setLastContentIndex(2);
    } else if (width < 1200) {
      setLastContentIndex(3);
    } else if (width < 1555) {
      setLastContentIndex(3);
    } else if (width < 1855) {
      setLastContentIndex(4);
    } else if (width < 2155) {
      setLastContentIndex(5);
    } else {
      setLastContentIndex(6);
    }
  }, [width]);

  return (
    <Container>
      {data?.results?.length > 0 && (
        <>
          <TitleWrapper>
            <Title>Votações</Title>
          </TitleWrapper>
          <Main>
            {[...Array(6).keys()].map((_, i) => {
              if (i < lastContentIndex && data?.results[i]) {
                return (
                  <div key={`profileStarPoll${data?.results[i].id}`}>
                    <PollCard poll={data?.results[i]} />
                  </div>
                );
              }
              if (i < lastContentIndex) {
                return <div key={`profileStarPollEmpty${i}`} />;
              }
              return '';
            })}
          </Main>
          <LineWrapper>
            <Line />
          </LineWrapper>
        </>
      )}
    </Container>
  );
};

export default StartPolls;
