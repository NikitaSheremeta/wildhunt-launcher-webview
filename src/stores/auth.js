import { defineStore } from 'pinia';
import { useNotificationsStore } from '@/stores/notifications';
import { ref } from 'vue';
import $api from '@/interceptors/index';
import { AUTH_ENDPOINTS } from '@/constants/endpoints';
import { HTTP_STATUS } from '@/constants/status-codes';
import { ALLOWED_THEMES } from '@/constants/themes';
import { buildResponseErrorMessage } from '@/utils/response-error-message';

export const useAuthStore = defineStore('auth', () => {
  const notificationsStore = useNotificationsStore();

  const isAuthenticated = ref(false);

  const isCheckingAuthLoading = ref(false);
  const isSignUpLoading = ref(false);
  const isLogInLoading = ref(false);
  const isLogOutLoading = ref(false);
  const isResetPasswordLoading = ref(false);
  const isResetCodeLoading = ref(false);
  const isNewPasswordLoading = ref(false);

  const setIsAuthenticated = (value) => {
    isAuthenticated.value = value;
  };

  const checkAuth = async () => {
    try {
      isCheckingAuthLoading.value = true;

      const response = await $api.get(AUTH_ENDPOINTS.REFRESH);

      if (response.status === HTTP_STATUS.OK) {
        setIsAuthenticated(true);

        notificationsStore.show('Токен обновлен', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({ endpoint: AUTH_ENDPOINTS.REFRESH, error }),
        ALLOWED_THEMES.ERROR,
      );

      return error.response;
    } finally {
      isCheckingAuthLoading.value = false;
    }
  };

  const signUp = async (data) => {
    try {
      isSignUpLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.SIGNUP, data);

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show('Вы успешно зарегистрированы', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({ endpoint: AUTH_ENDPOINTS.SIGNUP, error }),
        ALLOWED_THEMES.ERROR,
      );

      return error.response;
    } finally {
      isSignUpLoading.value = false;
    }
  };

  const logIn = async (data) => {
    try {
      isLogInLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.LOGIN, data);

      if (response.status === HTTP_STATUS.OK) {
        setIsAuthenticated(true);

        notificationsStore.show('Вы успешно вошли в аккаунт', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({ endpoint: AUTH_ENDPOINTS.LOGIN, error }),
        ALLOWED_THEMES.ERROR,
      );

      return error.response;
    } finally {
      isLogInLoading.value = false;
    }
  };

  const logOut = async () => {
    try {
      isLogOutLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.LOGOUT);

      if (response.status === HTTP_STATUS.OK) {
        setIsAuthenticated(false);

        notificationsStore.show('Вы успешно вышли из аккаунта', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({ endpoint: AUTH_ENDPOINTS.LOGOUT, error }),
        ALLOWED_THEMES.ERROR,
      );

      return error.response;
    } finally {
      isLogOutLoading.value = false;
    }
  };

  const resetPassword = async (data) => {
    try {
      isResetPasswordLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show(response.data.message, ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({ endpoint: AUTH_ENDPOINTS.RESET_PASSWORD, error }),
        ALLOWED_THEMES.ERROR,
      );

      return error.response;
    } finally {
      isResetPasswordLoading.value = false;
    }
  };

  const resetCode = async (data) => {
    try {
      isResetCodeLoading.value = true;

      const endpoint = `${AUTH_ENDPOINTS.RESET_CODE}/${data.code}`;

      const response = await $api.get(endpoint);

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show(response.data.message, ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({ endpoint: AUTH_ENDPOINTS.RESET_CODE, error }),
        ALLOWED_THEMES.ERROR,
      );

      return error.response;
    } finally {
      isResetCodeLoading.value = false;
    }
  };

  const newPassword = async (data) => {
    try {
      isNewPasswordLoading.value = true;

      const response = await $api.post(AUTH_ENDPOINTS.NEW_PASSWORD, data);

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show('Пароль успешно изменен', ALLOWED_THEMES.SUCCESS);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({ endpoint: AUTH_ENDPOINTS.NEW_PASSWORD, error }),
        ALLOWED_THEMES.ERROR,
      );

      return error.response;
    } finally {
      isNewPasswordLoading.value = false;
    }
  };

  return {
    isAuthenticated,
    isCheckingAuthLoading,
    isSignUpLoading,
    isLogInLoading,
    isLogOutLoading,
    isResetPasswordLoading,
    isResetCodeLoading,
    isNewPasswordLoading,
    setIsAuthenticated,
    checkAuth,
    signUp,
    logIn,
    logOut,
    resetPassword,
    resetCode,
    newPassword,
  };
});
