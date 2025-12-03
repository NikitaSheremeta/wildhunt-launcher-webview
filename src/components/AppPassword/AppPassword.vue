<template>
  <div :class="rootClasses">
    <AppInput
      v-model="state.value"
      :type="state.type"
      name="password"
      :placeholder="placeholder"
      :disabled="disabled"
      :validation="validation"
      :disable-success-icon="disableSuccessIcon"
      trim
      @blur="onBlur"
      @input="onInput"
    >
      <template #icon>
        <AppIcon
          :id="iconId"
          :icon="state.type === 'password' ? 'eye' : 'eye-slash'"
          color="#878796"
          class="cursor-pointer"
          @click="onClickIcon"
        />
      </template>

      <template v-if="create" #extension>
        <div class="grid grid-cols-3 gap-2 mt-3 w-full">
          <span :class="meterItemClasses(1)" />
          <span :class="meterItemClasses(2)" />
          <span :class="meterItemClasses(3)" />
        </div>

        <span
          v-if="state.notice"
          class="block mt-3 w-full text-sm select-none"
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
import { randomHash } from '@/utils/random-hash.js';
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
  DEFAULT: 'Пароль недостаточной длины',
  DANGER: 'Слабый пароль',
  WARNING: 'Средняя надёжность',
  SUCCESS: 'Надёжный пароль',
};

const iconId = randomHash(16);

const state = reactive({
  value: '',
  type: 'password',
  status: '', // '', 'invalid', 'danger', 'warning', 'success'
  notice: STRENGTH_NOTICE.DEFAULT,
});

const rootClasses = computed(() => ['w-full', props.disabled ? 'opacity-60' : '']);

const noticeClasses = computed(() => ({
  'text-green-500': state.status === 'success',
  'text-orange-500': state.status === 'warning',
  'text-red-500': state.status === 'danger' || state.status === 'invalid',
  'text-gray-600': state.status === '',
}));

const onClickIcon = () => {
  if (props.disabled) return;
  state.type = state.type === 'password' ? 'text' : 'password';
};

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const onBlur = () => {
  if (props.validation && typeof props.validation.blur === 'function') {
    props.validation.blur();
  }
  handleValidation();
};

watch(
  () => state.value,
  () => {
    emit('update:modelValue', state.value);
    reassign();
  },
);

function handleValidation() {
  if (props.validation && !props.validation.valid) {
    state.status = 'invalid';
    state.notice = props.validation.notice || '';
  }
}

function getStrengthScore() {
  let score = 0;

  if (!state.value || state.value.length === 0) {
    return score;
  }

  const letters = {};

  for (let i = 0; i < state.value.length; i++) {
    const ch = state.value[i];
    letters[ch] = (letters[ch] || 0) + 1;
    score += 5.0 / letters[ch];
  }

  const variations = {
    digits: REGULAR_EXPRESSIONS.DIGITS.test(state.value),
    lower: REGULAR_EXPRESSIONS.LOWERCASE.test(state.value),
    upper: REGULAR_EXPRESSIONS.UPPERCASE.test(state.value),
    special: REGULAR_EXPRESSIONS.SPECIAL_CHAR.test(state.value),
  };

  let variationsCount = 0;
  for (const key in variations) {
    if (variations[key]) variationsCount += 1;
  }

  score += (variationsCount - 1) * 10;

  return score;
}

function reassign() {
  handleValidation();

  if (props.validation && props.validation.valid && state.value.length >= VALIDATION_CONSTRAINTS.PASSWORD.MIN_LENGTH) {
    const strengthScore = getStrengthScore();

    if (strengthScore <= 25 && state.value.length >= VALIDATION_CONSTRAINTS.PASSWORD.MIN_LENGTH) {
      state.status = 'danger';
      state.notice = STRENGTH_NOTICE.DANGER;
    }

    if (strengthScore > 20 && strengthScore <= 50 && state.value.length !== 0) {
      state.status = 'warning';
      state.notice = STRENGTH_NOTICE.WARNING;
    }

    if (strengthScore > 50 && state.value.length !== 0) {
      state.status = 'success';
      state.notice = STRENGTH_NOTICE.SUCCESS;
    }
  } else if (!props.validation || props.validation.valid === undefined) {
    // Fallback notice when we do not have validation state
    state.status = '';
    state.notice = STRENGTH_NOTICE.DEFAULT;
  }
}

function meterItemClasses(position) {
  const base = 'w-full h-2 rounded bg-gray-800';

  if (state.status === 'danger') {
    return position === 1 ? base + ' bg-red-500' : base;
  }

  if (state.status === 'warning') {
    return position <= 2 ? base + ' bg-orange-500' : base;
  }

  if (state.status === 'success') {
    return base + ' bg-green-500';
  }

  if (state.status === 'invalid') {
    return position === 1 ? base + ' bg-red-500' : base;
  }

  return base;
}
</script>
