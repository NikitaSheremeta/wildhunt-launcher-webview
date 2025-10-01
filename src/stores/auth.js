import { defineStore } from 'pinia';
import { useNotificationsStore } from '@/stores/notifications';
import { ref } from 'vue';
import $api from '@/interceptors/index';
import { AUTH_ENDPOINTS } from '@/constants/endpoints';
import { ALLOWED_THEMES } from '@/constants/themes';

export const useAuthStore = defineStore('auth', () => {
  const notificationsStore = useNotificationsStore();

  const isCheckingAuthLoading = ref(false);
  const isSignUpLoading = ref(false);
  const isLogInLoading = ref(false);
  const isLogOutLoading = ref(false);

  // @TODO: Re-implement this method as a refresh token function.
  // @TODO: Implement a real checkAuth route.
  const checkAuth = async () => {
    try {
      isCheckingAuthLoading.value = true;

      return await $api.get(AUTH_ENDPOINTS.REFRESH);
    } catch (error) {
      notificationsStore.show(error.response.data.message, ALLOWED_THEMES.ERROR);

      return error.response;
    } finally {
      isCheckingAuthLoading.value = false;
    }
  };

  const signUp = async (data) => {
    try {
      isSignUpLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.SIGNUP, data);

      if (response.status === 200) {
        notificationsStore.show('Вы успешно зарегистрированы', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(error.response.data.message, ALLOWED_THEMES.ERROR);

      return error.response;
    } finally {
      isSignUpLoading.value = false;
    }
  };

  const logIn = async (data) => {
    try {
      isLogInLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.LOGIN, data);

      if (response.status === 200) {
        notificationsStore.show('Вы успешно вошли в аккаунт', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(error.response.data.message, ALLOWED_THEMES.ERROR);

      return error.response;
    } finally {
      isLogInLoading.value = false;
    }
  };

  const logOut = async () => {
    try {
      isLogOutLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.LOGOUT);

      if (response.status === 200) {
        notificationsStore.show('Вы успешно вышли из аккаунта', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(error.response.data.message, ALLOWED_THEMES.ERROR);

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
