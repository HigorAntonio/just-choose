import { useState, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';

import justChooseApi from '../services/justChooseApi';

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [authentication, setAuthentication] = useState(null);

  const refreshProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (authentication) {
        const { data } = await justChooseApi.get(
          `/profiles/${authentication.profile.name}`
        );
        setAuthentication((prevState) => ({ ...prevState, profile: data }));
      }
    } catch (error) {
      console.error('Falha ao obter dados do perfil do usuário');
      if (!error.response) {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [authentication]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      justChooseApi.defaults.headers.Authorization = `Bearer ${JSON.parse(
        accessToken
      )}`;
      const decoded = jwt_decode(accessToken);
      setAuthentication({ profile: { id: decoded.sub, name: decoded.name } });
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (
      authentication &&
      authentication.profile &&
      Object.keys(authentication.profile).length <= 2
    ) {
      refreshProfileData();
    }
  }, [refreshProfileData, authentication]);

  const handleRegistration = async (body) => {
    try {
      const {
        data: { access_token: accessToken, refresh_token: refreshToken },
      } = await justChooseApi.post('/signup', body);

      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

      justChooseApi.defaults.headers.Authorization = `Bearer ${accessToken}`;
      const decoded = jwt_decode(accessToken);
      setAuthentication({ profile: { id: decoded.sub, name: decoded.name } });
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
      setAuthentication({ profile: { id: decoded.sub, name: decoded.name } });
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const body = { refresh_token: JSON.parse(refreshToken) };
      await justChooseApi.delete('/logout', { data: body });

      setAuthentication(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      delete justChooseApi.defaults.headers.Authorization;
    } catch (error) {
      throw error;
    }
  };

  return {
    isLoading,
    isError,
    authentication,
    setAuthentication,
    handleRegistration,
    handleLogin,
    handleLogout,
    refreshProfileData,
  };
};

export default useAuth;
