import { objectSorting } from '@/utils/object-sorting';
import { reactive, ref, watch } from 'vue';

export function useFieldsValidation(rules, fields) {
  const createData = () => {
    const data = {};

    Object.keys(rules.value ?? {}).map((field) => {
      data[field] = {
        valid: false,
        touched: false,
        notice: '',
        errors: {},
        blur: () => {
          blur(field);
        },
        reset: () => {
          reset(field);
        },
      };

      for (const rule in rules.value[field]) {
        data[field].errors[rule] = '';
      }
    });

    return data;
  };

  const blur = (field) => {
    data[field].touched = true;
  };

  const reset = (field) => {
    data[field].valid = false;
    data[field].touched = false;
    data[field].notice = '';
    data[field].errors = {};
  };

  const reassign = () => {
    Object.keys(rules.value ?? {}).map((field) => {
      data[field].valid = true;

      for (const rule in rules.value[field]) {
        const isNotValid = rules.value[field][rule](state.value[field]);

        if (isNotValid) {
          data[field].errors[rule] = isNotValid;

          data[field].valid = false;
        } else {
          delete data[field].errors[rule];
        }
      }

      data[field].errors = objectSorting(data[field].errors, [
        'required',
        'allowedCharacters',
        'minLength',
        'maxLength',
        'email',
        'sameAs',
      ]);

      data[field].notice = Object.values(data[field].errors)[0];
    });
  };

  const state = ref(fields);

  const data = reactive(createData());

  reassign();

  watch(() => state.value, reassign, { deep: true });

  return data;
}
