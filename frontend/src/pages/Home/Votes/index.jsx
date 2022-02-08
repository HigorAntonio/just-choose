import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { ViewportContext } from '../../../context/ViewportContext';
import { AuthContext } from '../../../context/AuthContext';

import justChooseApi from '../../../services/justChooseApi';
import PollCard from '../../../components/PollCard';

import { Container } from './styles';

const Votes = () => {
  const { width } = useContext(ViewportContext);
  const { userId } = useContext(AuthContext);

  const [lastContentIndex, setLastContentIndex] = useState(0);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();

    userId &&
      (async () => {
        try {
          const { data } = await justChooseApi.get(`/users/${userId}/votes`, {
            params: {
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
  }, [userId]);

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
                <PollCard poll={poll} />
              </div>
            );
          }
          if (i < lastContentIndex) {
            return <div key={`profileStartVoteEmpty${i}`} />;
          }
          return '';
        })}
    </Container>
  );
};

export default Votes;
