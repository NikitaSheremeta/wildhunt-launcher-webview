import axios from 'axios';

// const $api = axios.create({ withCredentials: true });
const $api = axios.create();

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.config && !error.config.isRetry) {
      originalRequest.isRetry = true;

      try {
        const { data: response } = await axios.get('/auth/refresh', {
          withCredentials: true,
        });

        localStorage.setItem('token', response.data['accessToken']);

        return $api.request(originalRequest);
      } catch (err) {
        console.log('[interceptors.response]: ' + err.message);
      }
    }

    return Promise.reject(error);
  },
);

export default $api;
