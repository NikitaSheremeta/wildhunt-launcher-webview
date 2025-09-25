import { defineStore } from 'pinia';
import { ref } from 'vue';
import $api from '@/interceptors/index';

export const useAuthStore = defineStore('auth', () => {
  const isLogInLoading = ref(false);

  const logIn = async (data) => {
    try {
      isLogInLoading.value = true;

      await $api.post('/auth/login', data);
    } catch (error) {
      console.error('logIn: ' + error.message);
    } finally {
      isLogInLoading.value = false;
    }
  };

  return {
    isLogInLoading,
    logIn,
  };
});
