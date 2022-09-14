import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

import justChooseApi from '../services/justChooseApi';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [profileId, setProfileId] = useState();
  const [profileName, setProfileName] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      justChooseApi.defaults.headers.Authorization = `Bearer ${JSON.parse(
        accessToken
      )}`;
      const decoded = jwt_decode(accessToken);
      setProfileId(decoded.sub);
      setProfileName(decoded.name);
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const handleRegistration = async (body) => {
    try {
      const {
        data: { access_token: accessToken, refresh_token: refreshToken },
      } = await justChooseApi.post('/signup', body);

      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

      justChooseApi.defaults.headers.Authorization = `Bearer ${accessToken}`;
      const decoded = jwt_decode(accessToken);
      setProfileId(decoded.sub);
      setProfileName(decoded.name);
      setAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (body) => {
    try {
      const {
        data: { access_token: accessToken, refresh_token: refreshToken },
      } = await justChooseApi.post('/signin', body);

      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

      justChooseApi.defaults.headers.Authorization = `Bearer ${accessToken}`;
      const decoded = jwt_decode(accessToken);
      setProfileId(decoded.sub);
      setProfileName(decoded.name);
      setAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const body = { refresh_token: JSON.parse(refreshToken) };
      await justChooseApi.delete('/logout', { data: body });

      setAuthenticated(false);
      setProfileId(null);
      setProfileName(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      delete justChooseApi.defaults.headers.Authorization;
    } catch (error) {
      throw error;
    }
  };

  return {
    loading,
    profileId,
    profileName,
    authenticated,
    handleRegistration,
    handleLogin,
    handleLogout,
  };
};

export default useAuth;
