import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

import justChooseApi from '../apis/justChooseApi';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      justChooseApi.defaults.headers.Authorization = `Bearer ${JSON.parse(
        accessToken
      )}`;
      const decoded = jwt_decode(accessToken);
      setUserId(decoded.id);
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
      const decoded = jwt_decode(accessToken);
      setUserId(decoded.id);
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
      const decoded = jwt_decode(accessToken);
      setUserId(decoded.id);
      setAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const body = { refreshToken: JSON.parse(refreshToken) };
      await justChooseApi.delete('/logout', { data: body });

      setAuthenticated(false);
      setUserId(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      justChooseApi.defaults.headers.Authorization = undefined;
    } catch (error) {
      throw error;
    }
  };

  return {
    loading,
    userId,
    authenticated,
    handleRegistration,
    handleLogin,
    handleLogout,
  };
};

export default useAuth;
