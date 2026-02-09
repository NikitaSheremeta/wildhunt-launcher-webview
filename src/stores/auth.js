import { defineStore } from 'pinia';
import { useNotificationsStore } from '@/stores/notifications';
import { ref } from 'vue';
import { HTTP_STATUS } from '@/constants/status-codes';
import { ALLOWED_THEMES } from '@/constants/themes';
import { buildResponseErrorMessage } from '@/utils/response-error-message';
import { launcherAuth, request as launcherRequest } from '@/bridge/launcher-bridge';

export const useAuthStore = defineStore('auth', () => {
  const notificationsStore = useNotificationsStore();

  const isAuthenticated = ref(false);
  const isAuthResolved = ref(false);

  const isCheckingAuthLoading = ref(false);
  const isSignUpLoading = ref(false);
  const isLogInLoading = ref(false);
  const isLogOutLoading = ref(false);
  const isResetPasswordLoading = ref(false);
  const isResetCodeLoading = ref(false);
  const isNewPasswordLoading = ref(false);

  const setIsAuthenticated = (value) => {
    isAuthenticated.value = value;
    isAuthResolved.value = true;
  };

  /** @type {Promise<any> | null} */
  let checkAuthInFlight = null;

  const toResponseLikeError = (fallbackMessage, error) => {
    const message = buildResponseErrorMessage({ error, fallbackMessage });
    return { status: HTTP_STATUS.SERVICE_UNAVAILABLE, data: { message } };
  };

  const checkAuth = async ({ silent = false } = {}) => {
    if (checkAuthInFlight) {
      return checkAuthInFlight;
    }

    try {
      isCheckingAuthLoading.value = true;

      checkAuthInFlight = launcherAuth.checkAuth();
      const response = await checkAuthInFlight;

      if (response.status === HTTP_STATUS.OK) {
        setIsAuthenticated(true);

        if (!silent) {
          notificationsStore.show('Авторизация подтверждена', ALLOWED_THEMES.SUCCESS);
        }
      } else {
        // Any non-200 means "not authenticated" for UI layer.
        setIsAuthenticated(false);
      }

      return response;
    } catch (error) {
      setIsAuthenticated(false);

      if (!silent) {
        notificationsStore.show(
          buildResponseErrorMessage({
            error,
            fallbackMessage: 'Не удалось проверить авторизацию',
          }),
          ALLOWED_THEMES.ERROR,
        );
      }

      return toResponseLikeError('Не удалось проверить авторизацию', error);
    } finally {
      isCheckingAuthLoading.value = false;
      checkAuthInFlight = null;
    }
  };

  const signUp = async (data) => {
    try {
      isSignUpLoading.value = true;

      const response = await launcherRequest('auth.signup', data);

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show('Вы успешно зарегистрированы', ALLOWED_THEMES.SUCCESS);
      } else {
        notificationsStore.show(response.data?.message || 'Не удалось зарегистрироваться', ALLOWED_THEMES.ERROR);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({
          error,
          fallbackMessage: 'Не удалось зарегистрироваться',
        }),
        ALLOWED_THEMES.ERROR,
      );

      return toResponseLikeError('Не удалось зарегистрироваться', error);
    } finally {
      isSignUpLoading.value = false;
    }
  };

  const logIn = async (data) => {
    try {
      isLogInLoading.value = true;

      const response = await launcherAuth.login(data?.login, data?.password);

      if (response.status === HTTP_STATUS.OK) {
        setIsAuthenticated(true);

        notificationsStore.show('Вы успешно вошли в аккаунт', ALLOWED_THEMES.SUCCESS);
      } else {
        notificationsStore.show(response.data?.message || 'Не удалось войти в аккаунт', ALLOWED_THEMES.ERROR);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({
          error,
          fallbackMessage: 'Не удалось войти в аккаунт',
        }),
        ALLOWED_THEMES.ERROR,
      );

      return toResponseLikeError('Не удалось войти в аккаунт', error);
    } finally {
      isLogInLoading.value = false;
    }
  };

  const logOut = async () => {
    try {
      isLogOutLoading.value = true;

      const response = await launcherAuth.logout();

      if (response.status === HTTP_STATUS.OK) {
        setIsAuthenticated(false);

        notificationsStore.show('Вы успешно вышли из аккаунта', ALLOWED_THEMES.SUCCESS);
      } else {
        notificationsStore.show(response.data?.message || 'Не удалось выйти из аккаунта', ALLOWED_THEMES.ERROR);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({
          error,
          fallbackMessage: 'Не удалось выйти из аккаунта',
        }),
        ALLOWED_THEMES.ERROR,
      );

      return toResponseLikeError('Не удалось выйти из аккаунта', error);
    } finally {
      isLogOutLoading.value = false;
    }
  };

  const resetPassword = async (data) => {
    try {
      isResetPasswordLoading.value = true;

      const response = await launcherRequest('auth.resetPassword', data);

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show(response.data?.message || 'Запрос на сброс пароля отправлен', ALLOWED_THEMES.SUCCESS);
      } else {
        notificationsStore.show(
          response.data?.message || 'Не удалось отправить запрос на сброс пароля',
          ALLOWED_THEMES.ERROR,
        );
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({
          error,
          fallbackMessage: 'Не удалось отправить запрос на сброс пароля',
        }),
        ALLOWED_THEMES.ERROR,
      );

      return toResponseLikeError('Не удалось отправить запрос на сброс пароля', error);
    } finally {
      isResetPasswordLoading.value = false;
    }
  };

  const resetCode = async (data) => {
    try {
      isResetCodeLoading.value = true;

      const response = await launcherRequest('auth.resetCode', { code: data?.code });

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show(response.data?.message || 'Код подтверждён', ALLOWED_THEMES.SUCCESS);
      } else {
        notificationsStore.show(response.data?.message || 'Не удалось подтвердить код', ALLOWED_THEMES.ERROR);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({
          error,
          fallbackMessage: 'Не удалось подтвердить код',
        }),
        ALLOWED_THEMES.ERROR,
      );

      return toResponseLikeError('Не удалось подтвердить код', error);
    } finally {
      isResetCodeLoading.value = false;
    }
  };

  const newPassword = async (data) => {
    try {
      isNewPasswordLoading.value = true;

      const response = await launcherRequest('auth.newPassword', data);

      if (response.status === HTTP_STATUS.OK) {
        notificationsStore.show('Пароль успешно изменен', ALLOWED_THEMES.SUCCESS);
      } else {
        notificationsStore.show(response.data?.message || 'Не удалось изменить пароль', ALLOWED_THEMES.ERROR);
      }

      return response;
    } catch (error) {
      notificationsStore.show(
        buildResponseErrorMessage({
          error,
          fallbackMessage: 'Не удалось изменить пароль',
        }),
        ALLOWED_THEMES.ERROR,
      );

      return toResponseLikeError('Не удалось изменить пароль', error);
    } finally {
      isNewPasswordLoading.value = false;
    }
  };

  return {
    isAuthenticated,
    isAuthResolved,
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
