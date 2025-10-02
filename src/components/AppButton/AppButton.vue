<template>
  <button :id="id" :type="type" :disabled="disabled" :class="buttonClasses" @click="handleClick">
    <AppIcon
      v-if="loading"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      spin
      icon="preloader"
    />

    <AppIcon
      v-if="iconLeft"
      :color="color"
      :icon="iconLeft"
      :width="computedIconSize"
      :height="computedIconSize"
      :class="leftIconClasses"
    />

    <AppIcon v-if="icon" :icon="icon" :color="color" :width="computedIconSize" :height="computedIconSize" />

    <span v-if="showLabel" :class="labelClasses" v-text="label" />

    <AppIcon
      v-if="iconRight"
      :color="color"
      :icon="iconRight"
      :width="computedIconSize"
      :height="computedIconSize"
      :class="rightIconClasses"
    />
  </button>
</template>

<script setup>
import { computed } from 'vue';

import AppIcon from '@/components/AppIcon/AppIcon.vue';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'button',
  },
  theme: {
    type: String,
    default: 'primary',
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  iconSize: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconLeft: {
    type: String,
    default: '',
  },
  iconRight: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const THEME_STYLES = {
  primary: 'bg-violet-500 md:hover:bg-violet-600 md:focus:bg-violet-600 active:bg-violet-600',
  secondary: 'bg-gray-800 md:hover:bg-gray-900 md:focus:bg-gray-900 active:bg-gray-900',
};

const buttonClasses = computed(() => [
  'relative inline-flex items-center justify-center px-12 h-12 rounded-xl text-white w-full overflow-hidden select-none transition duration-200',
  !props.disabled ? THEME_STYLES[props.theme] : '',
  props.disabled ? 'cursor-default bg-gray-900/80' : 'cursor-pointer',
  iconOnly.value ? 'p-0 w-12 h-12 rounded-full' : '',
]);

const iconOnly = computed(() => !props.label && (props.icon || props.iconLeft || props.iconRight));
const showLabel = computed(() => Boolean(props.label) && !props.icon);
const labelClasses = computed(() => (props.loading ? 'opacity-0' : ''));

const leftIconClasses = computed(() => (showLabel.value ? 'mr-3' : ''));
const rightIconClasses = computed(() => (showLabel.value ? 'ml-3' : ''));

const computedIconSize = computed(() => props.iconSize || '18');

const handleClick = (event) => {
  if (props.disabled || props.loading) {
    return;
  }

  emit('click', event);
};
</script>
