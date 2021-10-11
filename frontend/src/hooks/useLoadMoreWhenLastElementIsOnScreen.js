import { useState, useEffect, useRef, useCallback } from 'react';

import useContentRequest from './useContentRequest';

const useLoadMoreWhenLastElementIsOnScreen = (url, params) => {
  const [page, setPage] = useState(1);

  const { loading, error, content, hasMore } = useContentRequest(
    url,
    params,
    page
  );

  useEffect(() => {
    setPage(1);
  }, [url, params]);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevState) => prevState + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, setPage]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { loading, error, content, hasMore, page, setPage, lastElementRef };
};

export default useLoadMoreWhenLastElementIsOnScreen;
