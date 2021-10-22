import { createContext } from 'react';

import useProfileData from '../hooks/useProfileData';

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const { loading, userProfile, setUserProfile, refreshUserProfileData } =
    useProfileData();

  return (
    <ProfileContext.Provider
      value={{ loading, userProfile, setUserProfile, refreshUserProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
