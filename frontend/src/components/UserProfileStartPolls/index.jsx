import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { ViewportContext } from '../../context/ViewportContext';

import justChooseApi from '../../apis/justChooseApi';
import UserProfilePollCard from '../UserProfilePollCard';

import { Container, TitleWrapper, Title, Main } from './styles';

const UserProfileStartPolls = () => {
  const { width } = useContext(ViewportContext);

  const { id: profileId } = useParams();

  const [lastContentIndex, setLastContentIndex] = useState(0);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();

    (async () => {
      try {
        const { data } = await justChooseApi.get('/polls', {
          params: {
            user_id: profileId,
            page: 1,
            page_size: 6,
            sort_by: 'updated.desc',
          },
          cancelToken: source.token,
        });
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
      {content.length > 0 && (
        <TitleWrapper>
          <Title>Votações</Title>
        </TitleWrapper>
      )}
      <Main>
        {content.length > 0 &&
          [...Array(6).keys()].map((_, i) => {
            if (i < lastContentIndex && content[i]) {
              return (
                <div key={`profileStarPoll${content[i].id}`}>
                  <UserProfilePollCard poll={content[i]} />
                </div>
              );
            }
            if (i < lastContentIndex) {
              return <div key={`profileStarPollEmpty${i}`} />;
            }
            return '';
          })}
      </Main>
    </Container>
  );
};

export default UserProfileStartPolls;
