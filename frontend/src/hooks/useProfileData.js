import { useContext, useState, useCallback, useEffect } from 'react';

import justChooseApi from '../services/justChooseApi';
import { AuthContext } from '../context/AuthContext';

const useProfileData = () => {
  const { loading: loadingAuth, profileName } = useContext(AuthContext);

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const refreshProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingError(false);

      if (profileName) {
        const { data } = await justChooseApi.get(`/profiles/${profileName}`);
        setProfile(data);
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
  }, [loadingAuth, profileName]);

  useEffect(() => {
    (async () => {
      await refreshProfileData();
    })();
  }, [refreshProfileData, profileName]);

  return {
    loading,
    loadingError,
    profile,
    setProfile,
    refreshProfileData,
  };
};

export default useProfileData;
