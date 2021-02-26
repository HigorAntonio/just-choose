import { useState, useEffect } from 'react';

import justChooseApi from '../../apis/justChooseApi';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      justChooseApi.defaults.headers.Authorization = `Bearer ${JSON.parse(
        accessToken
      )}`;
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const handleRegistration = async (body) => {
    try {
      const {
        data: { accessToken, refreshToken },
      } = await justChooseApi.post('/signup', body);

      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

      justChooseApi.defaults.headers.Authorization = `Bearer ${accessToken}`;
      setAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (body) => {
    try {
      const {
        data: { accessToken, refreshToken },
      } = await justChooseApi.post('/signin', body);

      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

      justChooseApi.defaults.headers.Authorization = `Bearer ${accessToken}`;
      setAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await justChooseApi.delete('/logout', { refreshToken });

      setAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      justChooseApi.defaults.headers.Authorization = undefined;
    } catch (error) {
      throw error;
    }
  };

  return {
    loading,
    authenticated,
    handleRegistration,
    handleLogin,
    handleLogout,
  };
};

export default useAuth;
