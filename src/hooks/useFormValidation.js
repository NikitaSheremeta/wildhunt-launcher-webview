import { reactive, unref } from 'vue';

export function useFormValidation(fieldsValidation) {
  const state = reactive({
    valid: false,
    checkValidity: () => {
      checkValidity();
    },
  });

  const checkValidity = () => {
    const fv = unref(fieldsValidation) ?? {};
    const invalidFields = [];

    for (const field in fv) {
      const fieldValidation = fv[field];
      if (!fieldValidation) continue;

      if (typeof fieldValidation.blur === 'function') {
        fieldValidation.blur();
      }

      if (!fieldValidation.valid) {
        invalidFields.push(field);
      }
    }

    state.valid = invalidFields.length === 0;
  };

  return state;
}
