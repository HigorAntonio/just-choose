import React, { useState, useEffect } from 'react';
import axios from 'axios';

import justChooseApi from '../../../services/justChooseApi';
import FollowingPolls from '../FollowingPolls';
import FollowingLists from '../FollowingLists';

import { Container, LineWrapper, Line } from './styles';

const Following = () => {
  const [polls, setPolls] = useState([]);
  const [contentLists, setContentLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();

    (async () => {
      try {
        const { data } = await justChooseApi.get('/following', {
          cancelToken: source.token,
        });
        setPolls(data.results.polls.results);
        setContentLists(data.results.content_lists.results);
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
  }, []);

  return (
    <Container>
      {polls.length > 0 && <FollowingPolls content={polls} />}
      <LineWrapper>
        <Line />
      </LineWrapper>
      {contentLists.length > 0 && <FollowingLists content={contentLists} />}
      <LineWrapper>
        <Line />
      </LineWrapper>
    </Container>
  );
};

export default Following;
