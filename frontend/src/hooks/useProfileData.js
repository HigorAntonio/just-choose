import { useContext, useState, useCallback, useEffect } from 'react';

import justChooseApi from '../services/justChooseApi';
import { AuthContext } from '../context/AuthContext';

const useProfileData = () => {
  const { loading: loadingAuth, userId } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const refreshUserProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingError(false);

      if (userId) {
        const { data } = await justChooseApi.get(`/users/${userId}`);
        setUserProfile(data);
      }
      if (!loadingAuth) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Falha ao obter dados do perfil do usuário');
      if (!error.response) {
        setLoadingError(true);
      }
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
    loadingError,
    userProfile,
    setUserProfile,
    refreshUserProfileData,
  };
};

export default useProfileData;
