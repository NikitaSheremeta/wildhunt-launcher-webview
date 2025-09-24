import { defineStore } from 'pinia';
import $api from '@/interceptors/index';

export const useAuthStore = defineStore('auth', () => {
  const fetchLogin = async (data) => {
    try {
      await $api.post('/auth/login', data);
    } catch (error) {
      console.error('/auth/login: ' + error.message);
    }
  };

  return {
    fetchLogin,
  };
});
