import { createContext } from 'react';

import useProfileData from '../hooks/useProfileData';

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const {
    loading,
    loadingError,
    userProfile,
    setUserProfile,
    refreshUserProfileData,
  } = useProfileData();

  return (
    <ProfileContext.Provider
      value={{
        loading,
        loadingError,
        userProfile,
        setUserProfile,
        refreshUserProfileData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
