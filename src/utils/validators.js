import { REGULAR_EXPRESSIONS } from '@/constants/regular-expressions';

function asString(value) {
  if (value == null) return '';
  return typeof value === 'string' ? value : String(value);
}

export function required(validationMessage) {
  return function (value) {
    const s = asString(value).trim();
    return s.length > 0 ? '' : validationMessage;
  };
}

export function minLength(number, validationMessage) {
  return function (value) {
    const len = asString(value).length;
    return len >= number ? '' : validationMessage;
  };
}

export function maxLength(number, validationMessage) {
  return function (value) {
    const len = asString(value).length;
    return len <= number ? '' : validationMessage;
  };
}

export function email(validationMessage) {
  return function (value) {
    return REGULAR_EXPRESSIONS.EMAIL.test(asString(value)) ? '' : validationMessage;
  };
}

export function sameAs(getComparedValue, validationMessage) {
  return function (value) {
    const compared = typeof getComparedValue === 'function' ? getComparedValue() : getComparedValue;
    return compared === value ? '' : validationMessage;
  };
}

export function allowedCharacters(validationMessage) {
  return function (value) {
    return REGULAR_EXPRESSIONS.ALLOWED_CHARACTERS.test(asString(value)) ? '' : validationMessage;
  };
}
