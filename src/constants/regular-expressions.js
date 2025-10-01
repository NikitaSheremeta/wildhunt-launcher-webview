// Non-digits (useful for replace to strip non-numeric)
export const NON_DIGITS_GLOBAL = /\D+/g;

// Character classes
export const DIGITS = /\d/;
export const LOWERCASE = /[a-z]/;
export const UPPERCASE = /[A-Z]/;

// Any non-alphanumeric character (treat underscore as special or not per requirements). Here underscore is treated as special.
export const SPECIAL_CHAR = /[^A-Za-z0-9]/;

// Allowed characters whitelist (escape hyphen and brackets correctly)
export const ALLOWED_CHARACTERS = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;

// Pragmatic email validation: local@domain.tld with 2+ letter TLD; case-insensitive
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const REGULAR_EXPRESSIONS = {
  NON_DIGITS_GLOBAL,
  DIGITS,
  LOWERCASE,
  UPPERCASE,
  SPECIAL_CHAR,
  ALLOWED_CHARACTERS,
  EMAIL,
};
