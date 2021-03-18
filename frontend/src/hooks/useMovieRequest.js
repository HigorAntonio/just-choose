import { useEffect, useState } from 'react';
import axios from 'axios';

import justChooseApi from '../apis/justChooseApi';

const useMovieRequest = (params, pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setMovies([]);
  }, [params]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    (async () => {
      try {
        const { data } = await justChooseApi.get('/movies', {
          params: { ...params, page: pageNumber },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        setMovies((prevState) => {
          return [...prevState, ...data.results];
        });
        setHasMore(data.page < data.total_pages);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        setError(true);
      }
    })();
    return () => cancel();
  }, [params, pageNumber]);

  return { loading, error, movies, hasMore };
};

export default useMovieRequest;
