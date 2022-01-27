import { useState, useEffect } from 'react';
import axios from 'axios';
import justChooseApi from '../apis/justChooseApi';

const useSearch = (query) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [content, setContent] = useState({});

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(false);
      let source = axios.CancelToken.source();

      (async () => {
        try {
          const { data } = await justChooseApi.get('/search', {
            params: { query },
            cancelToken: source.token,
          });
          setContent(data.results);
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
  }, [query]);

  return { loading, error, content };
};

export default useSearch;
