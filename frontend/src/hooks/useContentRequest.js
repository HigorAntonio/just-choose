import { useEffect, useState } from 'react';
import axios from 'axios';

import justChooseApi from '../services/justChooseApi';

const useContentRequest = (url, params, page) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [content, setContent] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setContent([]);
  }, [url, params]);

  useEffect(() => {
    if (url) {
      setLoading(true);
      setError(false);
      let source = axios.CancelToken.source();

      (async () => {
        try {
          const { data } = await justChooseApi.get(url, {
            params: { ...params, page },
            cancelToken: source.token,
          });
          setContent((prevState) => {
            return [...prevState, ...data.results];
          });
          setHasMore(data.page < data.total_pages || data.next);
          setLoading(false);
        } catch (error) {
          if (axios.isCancel(error)) {
            return;
          }
          setError(true);
        }
      })();

      return () => {
        source.cancel();
      };
    }
  }, [url, params, page]);

  return { loading, error, content, hasMore };
};

export default useContentRequest;
