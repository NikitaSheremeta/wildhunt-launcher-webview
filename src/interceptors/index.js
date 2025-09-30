import { AUTH_ROUTES } from '@/constants/routes';
import axios from 'axios';

// const $api = axios.create({ withCredentials: true });
const $api = axios.create();

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

$api.interceptors.response.use(
  (config) => {
    if (
      config.config.url.includes(AUTH_ROUTES.LOGIN) ||
      config.config.url.includes(AUTH_ROUTES.SIGNUP) ||
      config.config.url.includes(AUTH_ROUTES.REFRESH)
    ) {
      localStorage.setItem('token', config.data['accessToken']);
    }

    if (config.config.url.includes(AUTH_ROUTES.LOGOUT)) {
      localStorage.removeItem('token');
    }

    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.config && !error.config.isRetry) {
      originalRequest.isRetry = true;

      try {
        const { data: response } = await axios.get(AUTH_ROUTES.REFRESH, {
          withCredentials: true,
        });

        localStorage.setItem('token', response.data['accessToken']);

        return $api.request(originalRequest);
      } catch (err) {
        console.log('interceptors.response: ' + err.message);
      }
    }

    return Promise.reject(error);
  },
);

export default $api;
