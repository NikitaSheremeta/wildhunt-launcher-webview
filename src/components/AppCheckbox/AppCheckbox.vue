<template>
  <label :class="rootClasses" @mouseenter="onLabelMouseEnter" @mouseleave="onLabelMouseLeave">
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

      <span v-if="slots.default" @mouseenter.stop="onSlotMouseEnter" @mouseleave.stop="onSlotMouseLeave">
        <slot />
      </span>
    </span>
  </label>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue';

import AppIcon from '@/components/AppIcon/AppIcon.vue';

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
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const slots = useSlots();

const isHovered = ref(false);
const isSlotHovered = ref(false);

const hasContent = computed(() => Boolean(slots.default) || Boolean(props.label));

const rootClasses = computed(() => [
  'inline-flex gap-3 leading-tight select-none',
  props.disabled ? 'cursor-default opacity-60' : 'cursor-pointer',
]);

const checkboxClasses = computed(() => [
  'relative flex h-5 w-5 items-center justify-center rounded border-2 transition duration-150',
  props.modelValue ? 'bg-green-500 border-green-500 text-white' : 'border-gray-700 bg-transparent',
  props.disabled ? 'border-gray-800 bg-gray-900/80' : 'text-white',
  !props.disabled
    ? 'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-950 peer-focus-visible:ring-gray-100'
    : '',
]);

const iconClasses = computed(() => [
  'transition-opacity duration-150',
  props.modelValue || isHovered.value ? 'opacity-100' : 'opacity-0',
]);

const labelClasses = computed(() => ['text-sm', props.disabled ? 'text-gray-600' : 'text-gray-500']);

const onLabelMouseEnter = () => {
  if (props.disabled || isSlotHovered.value) {
    return;
  }

  isHovered.value = true;
};

const onLabelMouseLeave = () => {
  isHovered.value = false;
  isSlotHovered.value = false;
};

const onSlotMouseEnter = () => {
  isSlotHovered.value = true;
  isHovered.value = false;
};

const onSlotMouseLeave = () => {
  isSlotHovered.value = false;

  if (!props.disabled) {
    isHovered.value = true;
  }
};

const onChange = (event) => {
  const isChecked = event.target.checked;

  emit('update:modelValue', isChecked);
  emit('change', event);
};
</script>
