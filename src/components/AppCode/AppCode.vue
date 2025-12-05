<template>
  <div class="grid grid-cols-4 gap-3 w-full">
    <input
      v-for="(_, index) in code"
      :key="`code-digit-${index}`"
      :ref="(element) => setInputRef(element, index)"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      :maxlength="CODE_MAX_LENGTH"
      class="w-full h-12 text-white text-center outline-none border-none rounded-xl bg-gray-800 focus-within:bg-gray-900 transition duration-200"
      :value="code[index]"
      :disabled="disabled"
      aria-label="Поле ввода цифры кода"
      @input="(event) => onDigitInput(event, index)"
      @keydown="(event) => onDigitKeydown(event, index)"
      @paste="(event) => onDigitsPaste(event, index)"
    />
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';

import { VALIDATION_CONSTRAINTS } from '@/constants/validation-constraints';

const CODE_LENGTH = VALIDATION_CONSTRAINTS.CODE.NUMBERS_LENGTH;
const CODE_MAX_LENGTH = VALIDATION_CONSTRAINTS.CODE.MAX_LENGTH;

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const createEmptyCode = () => Array.from({ length: CODE_LENGTH }, () => '');

const code = ref(createEmptyCode());
const inputRefs = ref([]);

const emitCodeUpdate = () => {
  emit('update:modelValue', [...code.value]);
};

const setInputRef = (element, index) => {
  if (!element) {
    return;
  }

  inputRefs.value[index] = element;
};

const focusInput = (index) => {
  nextTick(() => {
    const input = inputRefs.value[index];

    if (input) {
      input.focus();
      input.select();
    }
  });
};

const resetCode = async () => {
  code.value = createEmptyCode();

  await nextTick();

  emitCodeUpdate();
  focusInput(0);
};

const sanitizeDigits = (value) => value.replace(/\D/g, '');

const fillDigitsFromIndex = (digits, startIndex) => {
  let currentIndex = startIndex;

  while (digits.length && currentIndex < CODE_LENGTH) {
    code.value[currentIndex] = digits.shift() || '';
    currentIndex += 1;
  }

  emitCodeUpdate();

  const nextIndex = Math.min(currentIndex, CODE_LENGTH - 1);

  focusInput(nextIndex);
};

const onDigitInput = (event, index) => {
  if (props.disabled) {
    event.preventDefault();

    return;
  }

  const sanitized = sanitizeDigits(event.target.value);

  if (!sanitized) {
    code.value[index] = '';

    emitCodeUpdate();

    return;
  }

  const digits = sanitized.split('');
  code.value[index] = digits.shift() || '';
  event.target.value = code.value[index];

  let nextIndex = index + 1;

  while (digits.length && nextIndex < CODE_LENGTH) {
    code.value[nextIndex] = digits.shift() || '';
    nextIndex += 1;
  }

  emitCodeUpdate();

  const targetIndex = Math.min(nextIndex, CODE_LENGTH - 1);

  if (index < CODE_LENGTH - 1) {
    focusInput(targetIndex);
  }
};

const onDigitKeydown = (event, index) => {
  if (props.disabled) {
    event.preventDefault();

    return;
  }

  const { key } = event;

  if (key === 'Backspace' || key === 'Delete') {
    event.preventDefault();

    if (!code.value[index] && index > 0) {
      code.value[index - 1] = '';

      emitCodeUpdate();
      focusInput(index - 1);

      return;
    }

    code.value[index] = '';

    emitCodeUpdate();

    return;
  }

  if (key === 'ArrowLeft' && index > 0) {
    event.preventDefault();

    focusInput(index - 1);

    return;
  }

  if (key === 'ArrowRight' && index < CODE_LENGTH - 1) {
    event.preventDefault();

    focusInput(index + 1);

    return;
  }

  if (!/^\d$/.test(key) && key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
  }
};

const onDigitsPaste = (event, index) => {
  if (props.disabled) {
    event.preventDefault();

    return;
  }

  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData?.getData('text') || '';
  const sanitized = sanitizeDigits(pastedText);

  if (!sanitized) {
    event.preventDefault();

    return;
  }

  event.preventDefault();

  const digits = sanitized.split('').slice(0, CODE_LENGTH);
  const shouldReset = digits.length >= CODE_LENGTH ? 0 : null;
  const startIndex = shouldReset === 0 ? 0 : index;

  if (shouldReset === 0) {
    code.value = createEmptyCode();
  }

  fillDigitsFromIndex(digits, startIndex);
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || !newValue.length) {
      resetCode();
    }
  },
  { deep: true },
);

onMounted(() => {
  focusInput(0);
});
</script>
