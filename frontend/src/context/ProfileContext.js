import { createContext } from 'react';

import useProfileData from '../hooks/useProfileData';

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const { loading, loadingError, profile, setProfile, refreshProfileData } =
    useProfileData();

  return (
    <ProfileContext.Provider
      value={{
        loading,
        loadingError,
        profile,
        setProfile,
        refreshProfileData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
