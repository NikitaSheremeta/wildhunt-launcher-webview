import {
  LOGIN_MIN_LENGTH,
  LOGIN_MAX_LENGTH,
  LOGIN_OR_EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  TOPIC_MIN_LENGTH,
  TOPIC_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  MESSAGE_MAX_LENGTH,
} from '@/constants/validation-constraints.js';

// BASE
export const BASE_REQUIRED = 'Это поле необходимо заполнить';
export const BASE_ALLOWED_CHARACTERS = 'Используйте латинские буквы, цифры и символы';

// LOGIN
export const LOGIN_MIN_LENGTH_MESSAGE = `Логин должен быть не менее ${LOGIN_MIN_LENGTH}-x символов`;
export const LOGIN_MAX_LENGTH_MESSAGE = `Логин должен быть не более ${LOGIN_MAX_LENGTH}-x символов`;

// LOGIN_OR_EMAIL
export const LOGIN_OR_EMAIL_MAX_LENGTH_MESSAGE = `Значение должно быть не более ${LOGIN_OR_EMAIL_MAX_LENGTH}-и символов`;

// PASSWORD
export const PASSWORD_MIN_LENGTH_MESSAGE = `Пароль должен быть не менее ${PASSWORD_MIN_LENGTH}-x символов`;
export const PASSWORD_MAX_LENGTH_MESSAGE = `Пароль должен быть не более ${PASSWORD_MAX_LENGTH}-x символов`;

// CONFIRM_PASSWORD
export const CONFIRM_PASSWORD_SAME_AS = 'Подтверждение не совпадает с паролем';

// EMAIL
export const EMAIL_INCORRECT = 'Введенная электронная почта некорректна';

// TOPIC
export const TOPIC_MIN_LENGTH_MESSAGE = `Заголовок темы должен быть не менее ${TOPIC_MIN_LENGTH}-и символов`;
export const TOPIC_MAX_LENGTH_MESSAGE = `Заголовок темы должен быть не более ${TOPIC_MAX_LENGTH}-и символов`;

// MESSAGE
export const MESSAGE_MIN_LENGTH_MESSAGE = `Описание проблемы должно быть не менее ${MESSAGE_MIN_LENGTH}-и символов`;
export const MESSAGE_MAX_LENGTH_MESSAGE = `Описание проблемы должно быть не более ${MESSAGE_MAX_LENGTH}-и символов`;

export const VALIDATION_MESSAGES = {
  BASE: {
    REQUIRED: BASE_REQUIRED,
    ALLOWED_CHARACTERS: BASE_ALLOWED_CHARACTERS,
  },
  LOGIN: {
    MIN_LENGTH: LOGIN_MIN_LENGTH_MESSAGE,
    MAX_LENGTH: LOGIN_MAX_LENGTH_MESSAGE,
  },
  LOGIN_OR_EMAIL: {
    MAX_LENGTH: LOGIN_OR_EMAIL_MAX_LENGTH_MESSAGE,
  },
  PASSWORD: {
    MIN_LENGTH: PASSWORD_MIN_LENGTH_MESSAGE,
    MAX_LENGTH: PASSWORD_MAX_LENGTH_MESSAGE,
  },
  CONFIRM_PASSWORD: {
    SAME_AS: CONFIRM_PASSWORD_SAME_AS,
  },
  EMAIL: {
    INCORRECT: EMAIL_INCORRECT,
  },
  TOPIC: {
    MIN_LENGTH: TOPIC_MIN_LENGTH_MESSAGE,
    MAX_LENGTH: TOPIC_MAX_LENGTH_MESSAGE,
  },
  MESSAGE: {
    MIN_LENGTH: MESSAGE_MIN_LENGTH_MESSAGE,
    MAX_LENGTH: MESSAGE_MAX_LENGTH_MESSAGE,
  },
};
