import React, { useState, useContext, useEffect } from 'react';

import { ViewportContext } from '../../../context/ViewportContext';
import { AuthContext } from '../../../context/AuthContext';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
import PollCard from '../../../components/PollCard';

import { Container, Wrapper, TitleWrapper, Title } from './styles';

const Votes = () => {
  const { width } = useContext(ViewportContext);
  const { authentication } = useContext(AuthContext);

  const [lastContentIndex, setLastContentIndex] = useState(0);

  const { isFetching, error, data } = useQuery(
    ['home/votes', authentication],
    async () => {
      const response = await justChooseApi.get(
        `/profiles/${authentication?.profile?.id}/votes`,
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
        <>
          <TitleWrapper>
            <Title>Seus votos</Title>
          </TitleWrapper>
          <Wrapper>
            {[...Array(6).keys()].map((_, i) => {
              if (i < lastContentIndex && data?.results[i]) {
                const poll = {
                  id: data?.results[i].poll_id,
                  profile_id: data?.results[i].poll_profile_id,
                  profile_name: data?.results[i].poll_profile_name,
                  profile_display_name:
                    data?.results[i].poll_profile_display_name,
                  profile_image_url:
                    data?.results[i].poll_profile_profile_image_url,
                  thumbnail: data?.results[i].poll_thumbnail,
                  title: data?.results[i].poll_title,
                  is_active: data?.results[i].poll_is_active,
                  total_votes: data?.results[i].poll_total_votes,
                  updated_at: data?.results[i].updated_at,
                };
                return (
                  <div key={`profileStartVote${poll.id}`}>
                    <PollCard poll={poll} showProfile />
                  </div>
                );
              }
              if (i < lastContentIndex) {
                return <div key={`profileStartVoteEmpty${i}`} />;
              }
              return '';
            })}
          </Wrapper>
        </>
      )}
    </Container>
  );
};

export default Votes;
