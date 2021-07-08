import { useEffect, useState } from 'react';
import axios from 'axios';

import justChooseApi from '../apis/justChooseApi';

const useContentRequest = (url, params, pageNumber) => {
  const [loading, setLoading] = useState(false);
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
      let cancel;
      (async () => {
        try {
          const { data } = await justChooseApi.get(url, {
            params: { ...params, page: pageNumber },
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
          });

          if (data.results) {
            setContent((prevState) => {
              return [...prevState, ...data.results];
            });
          }

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
  }, [url, params, pageNumber]);

  return { loading, error, content, hasMore };
};

export default useContentRequest;
