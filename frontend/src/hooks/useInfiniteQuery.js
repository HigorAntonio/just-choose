import { useContext, useRef, useCallback, useEffect } from 'react';
import { useInfiniteQuery as useReactInfiniteQuery } from 'react-query';

import { AuthContext } from '../context/AuthContext';

const useInfiniteQuery = (queryKey, axiosGetFn, options) => {
  const { setAuthentication } = useContext(AuthContext);

  const queryFn = async (options) => {
    try {
      return await axiosGetFn(options);
    } catch (error) {
      if (
        error.response &&
        error.response.data.message &&
        (error.response.data.message === 'invalid "refresh_token"' ||
          error.response.data.message === 'invalid "access_token"')
      ) {
        setAuthentication(null);
      }
      throw error;
    }
  };

  const queryResult = useReactInfiniteQuery(queryKey, queryFn, options);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (queryResult.isFetchingNextPage) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && queryResult.hasNextPage) {
          queryResult.fetchNextPage();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [queryResult]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { ...queryResult, lastElementRef };
};

export default useInfiniteQuery;
