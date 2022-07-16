import {
  createContext,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';

import { AuthContext } from './AuthContext';
import useAuthenticatedRequest from '../hooks/useAuthenticatedRequest';

export const FollowingProfilesContext = createContext();

export const FollowingProfilesContextProvider = ({ children }) => {
  const { profileId } = useContext(AuthContext);

  const [followsParams] = useState({});
  const [followsPageNumber, setFollowsPageNumber] = useState(1);

  const {
    data: following,
    setData: setFollowing,
    hasMore: followsHasMore,
    loading: followsLoading,
  } = useAuthenticatedRequest(
    `/profiles/${profileId}/following`,
    followsParams,
    followsPageNumber
  );

  const followsObserver = useRef();
  const lastFollowRef = useCallback(
    (node) => {
      if (followsLoading) {
        return;
      }
      if (followsObserver.current) {
        followsObserver.current.disconnect();
      }
      followsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && followsHasMore) {
          setFollowsPageNumber((prevState) => prevState + 1);
        }
      });
      if (node) {
        followsObserver.current.observe(node);
      }
    },
    [followsLoading, followsHasMore, setFollowsPageNumber]
  );

  return (
    <FollowingProfilesContext.Provider
      value={{
        following,
        setFollowing,
        lastFollowRef,
      }}
    >
      {children}
    </FollowingProfilesContext.Provider>
  );
};
