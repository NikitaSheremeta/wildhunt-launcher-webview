import { computed, unref } from 'vue';

export function useFormValidator(fieldsValidation) {
  const fv = computed(() => unref(fieldsValidation) ?? {});

  const isValid = computed(() => {
    const validations = Object.values(fv.value);
    if (validations.length === 0) return false;

    return validations.every((fieldValidation) => fieldValidation && fieldValidation.valid === true);
  });

  const touchAll = () => {
    Object.values(fv.value).forEach((fieldValidation) => {
      if (fieldValidation && typeof fieldValidation.blur === 'function') {
        fieldValidation.blur();
      }
    });
  };

  const validate = () => {
    touchAll();
    return isValid.value;
  };

  return { isValid, validate };
}
