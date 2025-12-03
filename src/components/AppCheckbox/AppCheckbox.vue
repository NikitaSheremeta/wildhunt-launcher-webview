<template>
  <label :class="rootClasses">
    <input
      :id="id"
      class="peer sr-only"
      type="checkbox"
      :name="name"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      :aria-checked="modelValue"
      :aria-disabled="disabled"
      @change="onChange"
    />

    <span :class="checkboxClasses">
      <AppIcon icon="check" width="12" height="12" color="white" aria-hidden="true" :class="iconClasses" />
    </span>

    <span v-if="hasContent" :class="labelClasses">
      <span v-if="label" class="mr-1" v-text="label" />

      <slot />
    </span>
  </label>
</template>

<script setup>
import { computed, useSlots } from 'vue';

import AppIcon from '@/components/AppIcon/AppIcon.vue';

const VARIANT_STYLES = {
  primary: {
    checked: 'bg-violet-500 border-violet-500',
    hover: 'group-hover:border-violet-400',
    ring: 'peer-focus-visible:ring-violet-400',
    label: 'text-gray-200',
  },
  secondary: {
    checked: 'bg-gray-200 border-gray-200',
    hover: 'group-hover:border-gray-100',
    ring: 'peer-focus-visible:ring-gray-100',
    label: 'text-gray-500',
  },
  success: {
    checked: 'bg-green-500 border-green-500',
    hover: 'group-hover:border-green-400',
    ring: 'peer-focus-visible:ring-green-400',
    label: 'text-gray-200',
  },
  warning: {
    checked: 'bg-orange-500 border-orange-500',
    hover: 'group-hover:border-orange-400',
    ring: 'peer-focus-visible:ring-orange-400',
    label: 'text-gray-200',
  },
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number, Boolean],
    default: 'on',
  },
  color: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const slots = useSlots();

const variant = computed(() => VARIANT_STYLES[props.color] || VARIANT_STYLES.primary);

const hasContent = computed(() => Boolean(slots.default) || Boolean(props.label));

const rootClasses = computed(() => [
  'group inline-flex gap-3 leading-tight select-none',
  props.disabled ? 'cursor-default opacity-60' : 'cursor-pointer',
]);

const checkboxClasses = computed(() => [
  'relative flex h-5 w-5 items-center justify-center rounded border-2 transition duration-150',
  props.modelValue ? variant.value.checked : 'border-gray-700 bg-transparent',
  props.disabled ? 'border-gray-800 bg-gray-900/80' : 'text-white',
  !props.disabled
    ? `peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-950 ${variant.value.ring} ${variant.value.hover}`
    : '',
]);

const iconClasses = computed(() => ['transition-opacity duration-150', props.modelValue ? 'opacity-100' : 'opacity-0']);

const labelClasses = computed(() => ['text-sm', props.disabled ? 'text-gray-500' : variant.value.label]);

const onChange = (event) => {
  const isChecked = event.target.checked;
  emit('update:modelValue', isChecked);
  emit('change', event);
};
</script>
