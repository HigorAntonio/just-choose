import { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';
import justChooseApi from '../apis/justChooseApi';

const useUserRequest = (url, params, pageNumber) => {
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
      let cancel;
      (async () => {
        try {
          const { data } = await justChooseApi.get(url, {
            params: { ...params, page: pageNumber },
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
          });
          setData((prevState) => {
            return [...prevState, ...data.items];
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
      return () => cancel();
    }
  }, [url, params, pageNumber, authenticated]);

  return { loading, error, data, hasMore };
};

export default useUserRequest;
