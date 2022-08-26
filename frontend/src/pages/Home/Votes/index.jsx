import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { ViewportContext } from '../../../context/ViewportContext';
import { AuthContext } from '../../../context/AuthContext';

import justChooseApi from '../../../services/justChooseApi';
import PollCard from '../../../components/PollCard';

import { Container, Wrapper, TitleWrapper, Title } from './styles';

const Votes = () => {
  const { width } = useContext(ViewportContext);
  const { profileId } = useContext(AuthContext);

  const [lastContentIndex, setLastContentIndex] = useState(0);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();

    profileId &&
      (async () => {
        try {
          const { data } = await justChooseApi.get(
            `/profiles/${profileId}/votes`,
            {
              params: {
                page: 1,
                page_size: 6,
                sort_by: 'updated.desc',
              },
              cancelToken: source.token,
            }
          );
          setContent(data.results);
          setLoading(false);
        } catch (error) {
          if (axios.isCancel(error)) {
            return;
          }
          setLoading(false);
        }
      })();

    return () => {
      source.cancel();
    };
  }, [profileId]);

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
      <TitleWrapper>
        <Title>Seus votos</Title>
      </TitleWrapper>
      <Wrapper>
        {content.length > 0 &&
          [...Array(6).keys()].map((_, i) => {
            if (i < lastContentIndex && content[i]) {
              const poll = {
                id: content[i].poll_id,
                profile_id: content[i].poll_profile_id,
                profile_name: content[i].poll_profile_name,
                profile_image_url: content[i].poll_profile_profile_image_url,
                thumbnail: content[i].poll_thumbnail,
                title: content[i].poll_title,
                is_active: content[i].poll_is_active,
                total_votes: content[i].poll_total_votes,
                updated_at: content[i].updated_at,
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
    </Container>
  );
};

export default Votes;
