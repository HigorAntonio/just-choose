import React, { useState, useContext, useEffect } from 'react';

import { ViewportContext } from '../../../context/ViewportContext';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
import PollCard from '../../../components/PollCard';

import { Container, TitleWrapper, Title, Main } from './styles';

const StartVotes = ({ profileToShowId }) => {
  const { width } = useContext(ViewportContext);

  const [lastContentIndex, setLastContentIndex] = useState(0);

  const { isFetching, data } = useQuery(
    ['profile/start/votes', profileToShowId],
    async () => {
      const response = await justChooseApi.get(
        `/profiles/${profileToShowId}/votes`,
        {
          params: {
            page: 1,
            page_size: 6,
            sort_by: 'updated.desc',
          },
        }
      );
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
        <TitleWrapper>
          <Title>Votos</Title>
        </TitleWrapper>
      )}
      <Main>
        {data?.results?.length > 0 &&
          [...Array(6).keys()].map((_, i) => {
            if (i < lastContentIndex && data?.results[i]) {
              const poll = {
                id: data?.results[i].poll_id,
                thumbnail: data?.results[i].poll_thumbnail,
                title: data?.results[i].poll_title,
                is_active: data?.results[i].poll_is_active,
                total_votes: data?.results[i].poll_total_votes,
                updated_at: data?.results[i].updated_at,
              };
              return (
                <div key={`profileStartVote${poll.id}`}>
                  <PollCard poll={poll} />
                </div>
              );
            }
            if (i < lastContentIndex) {
              return <div key={`profileStartVoteEmpty${i}`} />;
            }
            return '';
          })}
      </Main>
    </Container>
  );
};

export default StartVotes;
