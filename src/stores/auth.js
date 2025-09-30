import { defineStore } from 'pinia';
import { ref } from 'vue';
import $api from '@/interceptors/index';
import { AUTH_ENDPOINTS } from '@/constants/endpoints';

export const useAuthStore = defineStore('auth', () => {
  const isCheckingAuthLoading = ref(false);
  const isSignUpLoading = ref(false);
  const isLogInLoading = ref(false);
  const isLogOutLoading = ref(false);

  const checkAuth = async () => {
    try {
      isCheckingAuthLoading.value = true;

      return await $api.get(AUTH_ENDPOINTS.REFRESH);
    } catch (error) {
      return error.response;
    } finally {
      isCheckingAuthLoading.value = false;
    }
  };

  const signUp = async (data) => {
    try {
      isSignUpLoading.value = true;

      return await $api.post(AUTH_ENDPOINTS.SIGNUP, data);
    } catch (error) {
      return error.response;
    } finally {
      isSignUpLoading.value = false;
    }
  };

  const logIn = async (data) => {
    try {
      isLogInLoading.value = true;

      return await $api.post(AUTH_ENDPOINTS.LOGIN, data);
    } catch (error) {
      return error.response;
    } finally {
      isLogInLoading.value = false;
    }
  };

  const logOut = async () => {
    try {
      isLogOutLoading.value = true;

      return await $api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      return error.response;
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
