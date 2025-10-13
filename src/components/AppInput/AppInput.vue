<template>
  <div :class="rootClasses">
    <div
      class="flex items-center justify-between h-12 select-none rounded-xl bg-gray-800 focus-within:bg-gray-900 transition duration-200"
    >
      <input
        v-if="!textarea"
        ref="inputRef"
        class="px-6 w-full h-full bg-transparent border-0 text-white placeholder:text-gray-600 outline-none"
        :value="modelValue"
        :type="type"
        :data-id="dataId"
        :name="name"
        :autofocus="autofocus"
        :autocomplete="autocomplete ? 'on' : 'off'"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength || undefined"
        v-on="inputListeners"
      />

      <textarea
        v-else
        ref="inputRef"
        class="px-6 py-3 w-full h-full bg-transparent border-0 text-white placeholder:text-gray-600 outline-none resize-none"
        :value="modelValue"
        :name="name"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength || undefined"
        v-on="inputListeners"
      />

      <div v-if="shouldDisplayIcon" class="flex items-center gap-3 pr-6" @mousedown.prevent @mouseup="onMouseupIcon">
        <slot v-if="$slots.icon" name="icon" />

        <AppIcon v-if="icon" :icon="icon" />

        <AppIcon
          v-if="validation && !disableSuccessIcon && validation.valid"
          icon="check"
          color="green-500"
          width="16"
          height="16"
        />

        <AppIcon
          v-if="validation && validation.touched && !validation.valid"
          icon="exclamation"
          color="orange-500"
          width="16"
          height="16"
        />
      </div>
    </div>

    <slot v-if="$slots.extension" name="extension" />

    <span
      v-if="shouldDisplayValidationMessage"
      class="block mt-3 text-sm select-none"
      :class="validationClasses"
      v-text="validation.notice"
    />
  </div>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue';
import AppIcon from '@/components/AppIcon/AppIcon.vue';

const ALLOWED_KEYS = [
  'Backspace',
  'Delete',
  'ArrowRight',
  'ArrowLeft',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  textarea: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  dataId: {
    type: [Number, String, null],
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
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
  icon: {
    type: String,
    default: '',
  },
  maxLength: {
    type: [Number, null],
    default: null,
  },
  trim: {
    type: Boolean,
    default: false,
  },
  notice: {
    type: String,
    default: '',
  },
  disableNotice: {
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

const emit = defineEmits(['update:modelValue', 'keydown', 'input', 'click', 'focus', 'blur']);

const inputRef = ref(null);
const slots = useSlots();

const isValid = computed(() => Boolean(props.validation && props.validation.touched && props.validation.valid));
const isInvalid = computed(() => Boolean(props.validation && props.validation.touched && !props.validation.valid));

const rootClasses = computed(() => [
  'w-full',
  props.textarea ? 'h-40' : '',
  isValid.value ? 'group valid' : '',
  isInvalid.value ? 'group invalid' : '',
  props.disabled ? 'opacity-60' : '',
]);

const shouldDisplayIcon = computed(
  () =>
    Boolean(slots.icon) ||
    Boolean(props.icon) ||
    (props.validation && !props.disableSuccessIcon && props.validation.valid) ||
    (props.validation && props.validation.touched && !props.validation.valid),
);

const shouldDisplayValidationMessage = computed(() =>
  Boolean(props.validation && props.validation.touched && props.validation.notice && !props.disableNotice),
);

const validationClasses = computed(() => ({
  'text-orange-500': isInvalid.value,
  'text-green-500': isValid.value,
  'text-gray-600': !isInvalid.value && !isValid.value,
}));

const inputListeners = computed(() => ({
  keydown: (event) => {
    if (event.key === 'Escape') {
      if (inputRef.value) {
        inputRef.value.blur();
      }
    }

    if (props.type === 'number') {
      if (!ALLOWED_KEYS.includes(event.key)) {
        event.preventDefault();
      }
    }

    emit('keydown', event);
  },
  input: (event) => {
    if (props.maxLength && props.maxLength < event.target.value.length) {
      event.target.value = event.target.value.substring(0, props.maxLength);
    }

    if (props.trim) {
      event.target.value = event.target.value.replace(/\s/g, '');
    }

    emit('input', event);
    emit('update:modelValue', event.target.value);
  },
  click: (event) => emit('click', event),
  focus: (event) => emit('focus', event),
  blur: (event) => {
    if (props.validation && typeof props.validation.blur === 'function') {
      props.validation.blur();
    }

    emit('blur', event);
  },
}));

const onMouseupIcon = () => {
  setTimeout(() => {
    const inputElement = inputRef.value;

    if (!inputElement) {
      return;
    }

    const length = inputElement.value ? inputElement.value.length : 0;

    inputElement.selectionStart = length;
    inputElement.selectionEnd = length;
  });
};
</script>
