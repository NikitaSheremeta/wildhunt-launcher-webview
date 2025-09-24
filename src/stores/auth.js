import { defineStore } from 'pinia';
import $api from '@/interceptors/index';

export const useAuthStore = defineStore('auth', () => {
  const fetchLogin = async (data) => {
    try {
      const response = await $api.post('/auth/login', data);

      localStorage.setItem('token', response.data['accessToken']);
    } catch (error) {
      console.error('/auth/login: ' + error.message);
    }
  };

  return {
    fetchLogin,
  };
});
