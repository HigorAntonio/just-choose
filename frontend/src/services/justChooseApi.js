import axios from 'axios';

const justChooseApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

justChooseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      const originalRequest = error.config;

      if (error.response.status === 401 && originalRequest.url === '/token') {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest.retry) {
        originalRequest.retry = true;

        const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

        const {
          data: { access_token: accessToken, refresh_token: newRefreshToken },
        } = await justChooseApi.post('/token', { refresh_token: refreshToken });

        localStorage.setItem('accessToken', JSON.stringify(accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));

        justChooseApi.defaults.headers.Authorization = `Bearer ${accessToken}`;

        return await justChooseApi({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {}

    return Promise.reject(error);
  }
);

export default justChooseApi;
