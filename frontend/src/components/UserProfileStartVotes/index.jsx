import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ViewportContext } from '../../context/ViewportContext';

import justChooseApi from '../../apis/justChooseApi';
import UserProfilePollCard from '../UserProfilePollCard';

import { Container, TitleWrapper, Title, Main } from './styles';

const UserProfileStartVotes = () => {
  const { width } = useContext(ViewportContext);

  const { id: profileId } = useParams();

  const [lastContentIndex, setLastContentIndex] = useState(0);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await justChooseApi.get(`/users/${profileId}/votes`, {
          params: {
            page: 1,
            page_size: 6,
            sort_by: 'updated.desc',
          },
        });
        setContent(data.results);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
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
      {content.length > 0 && (
        <TitleWrapper>
          <Title>Votos</Title>
        </TitleWrapper>
      )}
      <Main>
        {content.length > 0 &&
          [...Array(6).keys()].map((_, i) => {
            if (i < lastContentIndex && content[i]) {
              const poll = {
                id: content[i].poll_id,
                thumbnail: content[i].poll_thumbnail,
                title: content[i].poll_title,
                is_active: content[i].poll_is_active,
                updated_at: content[i].updated_at,
              };
              return (
                <div key={`profileStartVote${poll.id}`}>
                  <UserProfilePollCard poll={poll} />
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

export default UserProfileStartVotes;
