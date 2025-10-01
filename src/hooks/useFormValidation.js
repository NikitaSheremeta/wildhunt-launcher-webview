import { reactive } from 'vue';

export function useFormValidation(element) {
  const data = reactive({
    valid: false,
    checkValidity: () => {
      checkValidity();
    },
  });

  const checkValidity = () => {
    const invalidFields = [];

    for (const field in element.value.fieldsValidation) {
      const fieldValidation = element.value.fieldsValidation[field];

      fieldValidation.blur();

      if (!fieldValidation.valid) {
        invalidFields.push(field);
      }
    }

    data.valid = !invalidFields.length;
  };

  return data;
}
