import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';

import { AuthContext } from './AuthContext';

import justChooseApi from '../apis/justChooseApi';

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState({});

  const getUserProfileData = useCallback(async () => {
    try {
      if (userId) {
        const { data } = await justChooseApi.get(`/users/${userId}`);
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Falha ao obter dados do perfil do usuário');
    }
  }, [userId]);

  useEffect(() => {
    (async () => {
      await getUserProfileData();
    })();
  }, [getUserProfileData, userId]);

  return (
    <ProfileContext.Provider
      value={{ userProfile, setUserProfile, getUserProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
