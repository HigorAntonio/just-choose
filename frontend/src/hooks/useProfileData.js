import { useContext, useState, useCallback, useEffect } from 'react';

import justChooseApi from '../apis/justChooseApi';
import { AuthContext } from '../context/AuthContext';

const useProfileData = () => {
  const { loading: loadingAuth, userId } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const refreshUserProfileData = useCallback(async () => {
    try {
      setLoading(true);
      if (userId) {
        const { data } = await justChooseApi.get(`/users/${userId}`);
        setUserProfile(data);
      }
      if (!loadingAuth) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Falha ao obter dados do perfil do usuário');
      setLoading(false);
    }
  }, [loadingAuth, userId]);

  useEffect(() => {
    (async () => {
      await refreshUserProfileData();
    })();
  }, [refreshUserProfileData, userId]);

  return {
    loading,
    userProfile,
    setUserProfile,
    refreshUserProfileData,
  };
};

export default useProfileData;
