import { defineStore } from 'pinia';
import { ref } from 'vue';
import $api from '@/interceptors/index';
import { AUTH_ROUTES } from '@/constants/routes';

export const useAuthStore = defineStore('auth', () => {
  const isCheckingAuthLoading = ref(false);
  const isSignUpLoading = ref(false);
  const isLogInLoading = ref(false);
  const isLogOutLoading = ref(false);

  const checkAuth = async () => {
    try {
      isCheckingAuthLoading.value = true;

      await $api.get(AUTH_ROUTES.REFRESH);
    } catch (error) {
      console.error('checkAuth: ' + error.message);
    } finally {
      isCheckingAuthLoading.value = false;
    }
  };

  const signUp = async (data) => {
    try {
      isSignUpLoading.value = true;

      await $api.post(AUTH_ROUTES.SIGNUP, data);
    } catch (error) {
      console.error('signUp: ' + error.message);
    } finally {
      isSignUpLoading.value = false;
    }
  };

  const logIn = async (data) => {
    try {
      isLogInLoading.value = true;

      await $api.post(AUTH_ROUTES.LOGIN, data);
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      isLogInLoading.value = false;
    }
  };

  const logOut = async () => {
    try {
      isLogOutLoading.value = true;

      await $api.post(AUTH_ROUTES.LOGOUT);
    } catch (error) {
      console.error('logOut: ' + error.message);
    } finally {
      isLogOutLoading.value = false;
    }
  };

  return {
    isCheckingAuthLoading,
    isSignUpLoading,
    isLogInLoading,
    isLogOutLoading,
    checkAuth,
    signUp,
    logIn,
    logOut,
  };
});
