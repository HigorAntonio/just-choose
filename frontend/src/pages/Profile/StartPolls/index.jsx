import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { ViewportContext } from '../../../context/ViewportContext';

import justChooseApi from '../../../services/justChooseApi';
import PollCard from '../../../components/PollCard';

import { Container, TitleWrapper, Title, Main } from './styles';

const StartPolls = ({ profileToShowId }) => {
  const { width } = useContext(ViewportContext);

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
            profile_id: profileToShowId,
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
  }, [profileToShowId]);

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
                  <PollCard poll={content[i]} />
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

export default StartPolls;
