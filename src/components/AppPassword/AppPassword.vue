<template>
  <div>
    <AppInput
      v-model="state.value"
      :type="state.type"
      name="password"
      :placeholder="placeholder"
      :disabled="disabled"
      :max-length="maxLength"
      disable-copy
      trim
      :disable-success-icon="disableSuccessIcon"
      :disable-notice="create"
      :validation="validation"
      @blur="onBlur"
      @input="onInput"
    >
      <template #icon>
        <AppIcon
          :icon="state.type === 'password' ? 'eye' : 'eye-slash'"
          color="gray-600"
          class="cursor-pointer"
          @click="onClickIcon"
        />
      </template>

      <template v-if="create" #extension>
        <div class="grid grid-cols-3 gap-2 mt-3 w-full">
          <span
            v-for="(color, index) in barColors"
            :key="index"
            class="block w-full rounded transition-colors h-2 bg-gray-800"
            :class="color"
          />
        </div>

        <span
          v-if="state.notice"
          class="block mt-3 w-full text-sm text-gray-600 select-none"
          :class="noticeClasses"
          v-text="state.notice"
        />
      </template>
    </AppInput>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import AppInput from '@/components/AppInput/AppInput.vue';
import AppIcon from '@/components/AppIcon/AppIcon.vue';
import { REGULAR_EXPRESSIONS } from '@/constants/regular-expressions.js';
import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints.js';

const props = defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  validation: {
    type: [Object, null],
    default: null,
  },
  disableSuccessIcon: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const STRENGTH_NOTICE = {
  DEFAULT: 'Используйте латинские буквы, цифры и символы',
  DANGER: 'Слабый пароль, его легко будет подобрать',
  WARNING: 'Хороший пароль, но мог бы быть надежнее',
  SUCCESS: 'Надежный пароль, только не забудьте его',
};

const state = reactive({
  value: props.modelValue || '',
  type: 'password',
  status: '', // '', 'invalid', 'danger', 'warning', 'success'
  notice: STRENGTH_NOTICE.DEFAULT,
});

const barColors = computed(() => {
  if (props.validation.touched && !props.validation.valid) {
    return ['', '', ''];
  }

  switch (state.status) {
    case 'danger':
      return ['bg-orange-500', '', ''];
    case 'warning':
      return ['bg-yellow-500', 'bg-yellow-500', ''];
    case 'success':
      return ['bg-green-500', 'bg-green-500', 'bg-green-500'];
    default:
      return ['', '', ''];
  }
});

const noticeClasses = computed(() => ({
  'text-yellow-500': state.status === 'warning',
  'text-green-500': state.status === 'success',
  'text-orange-500': state.status === 'danger' || (props.validation?.touched && !props.validation?.valid),
}));

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const onBlur = () => {
  props.validation.blur();

  handleValidation();
};

const onClickIcon = () => {
  if (props.disabled) {
    return;
  }

  state.type = state.type === 'password' ? 'text' : 'password';
};

const handleValidation = () => {
  if (!props.validation) {
    return;
  }

  if (!props.validation.valid) {
    state.status = 'invalid';
    state.notice = props.validation.notice;
  }
};

watch(
  () => state.value,
  () => reassign(),
);

watch(
  () => (props.validation ? props.validation.touched : false),
  (touched) => {
    if (touched) {
      handleValidation();

      return;
    }

    state.status = '';
    state.notice = STRENGTH_NOTICE.DEFAULT;
  },
);

const getStrengthScore = () => {
  let score = 0;

  if (state.value === '') {
    return score;
  }

  const letters = {};

  for (let i = 0; i < state.value.length; i++) {
    letters[state.value[i]] = (letters[state.value[i]] || 0) + 1;

    score += 5.0 / letters[state.value[i]];
  }

  const variations = {
    digits: REGULAR_EXPRESSIONS.DIGITS.test(state.value),
    lower: REGULAR_EXPRESSIONS.LOWERCASE.test(state.value),
    upper: REGULAR_EXPRESSIONS.UPPERCASE.test(state.value),
    special: REGULAR_EXPRESSIONS.SPECIAL_CHAR.test(state.value),
  };

  let variationsCount = 0;

  for (const check in variations) {
    variationsCount += variations[check] === true ? 1 : 0;
  }

  score += (variationsCount - 1) * 10;

  return score * 0.85;
};

const reassign = () => {
  handleValidation();

  if (props.validation.valid && state.value.length >= VALIDATION_CONSTRAINTS.PASSWORD.MIN_LENGTH) {
    const strengthScore = getStrengthScore();

    if (strengthScore <= 40) {
      state.status = 'danger';
      state.notice = STRENGTH_NOTICE.DANGER;
    } else if (strengthScore > 40 && strengthScore <= 70) {
      state.status = 'warning';
      state.notice = STRENGTH_NOTICE.WARNING;
    } else if (strengthScore > 70) {
      state.status = 'success';
      state.notice = STRENGTH_NOTICE.SUCCESS;
    }
  }
};
</script>
