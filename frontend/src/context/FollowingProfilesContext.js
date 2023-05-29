import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';

import { AuthContext } from './AuthContext';
import useInfiniteQuery from '../hooks/useInfiniteQuery';
import justChooseApi from '../services/justChooseApi';

export const FollowingProfilesContext = createContext();

export const FollowingProfilesContextProvider = ({ children }) => {
  const { authentication } = useContext(AuthContext);

  const [params] = useState({});
  const [followingProfilesData, setFollowingProfilesData] = useState([]);

  const getFollowing = useCallback(
    async ({ pageParam = 1 }) => {
      if (!authentication) {
        return undefined;
      }
      const response = await justChooseApi.get(
        `/profiles/${authentication?.profile?.id}/following`,
        {
          params: { ...params, page: pageParam },
        }
      );
      return response.data;
    },
    [authentication, params]
  );

  const { isFetching, isFetchingNextPage, refetch, data, lastElementRef } =
    useInfiniteQuery(
      ['followingProfilesContext/getFollowing', params, authentication],
      getFollowing,
      {
        getNextPageParam: (lastPage, pages) => {
          return lastPage?.page < lastPage?.total_pages
            ? pages?.length + 1
            : undefined;
        },
      }
    );

  useEffect(() => {
    if (authentication) {
      setFollowingProfilesData(
        data?.pages?.map((page) => page?.results).flat()
      );
    } else {
      setFollowingProfilesData([]);
    }
  }, [authentication, data]);

  const refetchFollowingProfilesData = () => {
    const lastPageIndex = data?.pages?.length || 0;
    refetch({ refetchPage: (_, index) => index <= lastPageIndex });
  };

  return (
    <FollowingProfilesContext.Provider
      value={{
        isFetching,
        isFetchingNextPage,
        followingProfilesData,
        refetchFollowingProfilesData,
        lastElementRef,
      }}
    >
      {children}
    </FollowingProfilesContext.Provider>
  );
};
