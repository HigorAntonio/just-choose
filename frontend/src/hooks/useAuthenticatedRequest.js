import { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';
import justChooseApi from '../apis/justChooseApi';

const useAuthenticatedRequest = (url, params, page) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    setData([]);
  }, [url, params, authenticated]);

  useEffect(() => {
    if (authenticated) {
      setLoading(true);
      setError(false);
      let source = axios.CancelToken.source();

      (async () => {
        try {
          const { data } = await justChooseApi.get(url, {
            params: { ...params, page },
            cancelToken: source.token,
          });
          setData((prevState) => {
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
  }, [url, params, page, authenticated]);

  return { loading, error, data, setData, hasMore };
};

export default useAuthenticatedRequest;
