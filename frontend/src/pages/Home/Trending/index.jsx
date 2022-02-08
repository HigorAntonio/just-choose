import React, { useState, useEffect } from 'react';
import axios from 'axios';

import justChooseApi from '../../../services/justChooseApi';
import TrendingLists from '../TrendingLists';

import { Container } from './styles';

const Trending = () => {
  const [contentLists, setContentLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();

    (async () => {
      try {
        const { data } = await justChooseApi.get('/trending', {
          cancelToken: source.token,
        });
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
      {contentLists.length > 0 && <TrendingLists content={contentLists} />}
    </Container>
  );
};

export default Trending;
