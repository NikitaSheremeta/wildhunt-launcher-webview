<template>
  <component
    :is="componentTag"
    v-bind="componentAttrs"
    :class="rootClasses"
    :aria-current="active ? 'page' : undefined"
  >
    <AppIcon
      v-if="iconLeft"
      :icon="iconLeft"
      :width="computedIconSize"
      :height="computedIconSize"
      :color="iconColor"
      :class="iconLeftClasses"
      aria-hidden="true"
    />

    <span class="inline-flex items-center gap-2">
      <slot>
        <span v-if="label" v-text="label" />
      </slot>

      <span v-if="active" class="w-1.5 h-1.5 rounded-full bg-green-500" />
    </span>

    <AppIcon
      v-if="iconRight"
      :icon="iconRight"
      :width="computedIconSize"
      :height="computedIconSize"
      :color="iconColor"
      :class="iconRightClasses"
      aria-hidden="true"
    />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import AppIcon from '@/components/AppIcon/AppIcon.vue';

const VARIANT_STYLES = {
  primary: {
    text: 'text-white md:hover:text-violet-400 md:focus-visible:text-violet-400',
    icon: 'text-white md:hover:text-violet-400 md:focus-visible:text-violet-400',
  },
  secondary: {
    text: 'text-gray-500 md:hover:text-white md:focus-visible:text-white',
    icon: 'text-gray-500 md:hover:text-white md:focus-visible:text-white',
  },
};

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  small: {
    type: Boolean,
    default: false,
  },
  underline: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  iconLeft: {
    type: String,
    default: '',
  },
  iconRight: {
    type: String,
    default: '',
  },
});

const isExternal = computed(() => /^https?:\/\//i.test(props.href));

const componentTag = computed(() => {
  if (props.disabled) {
    return 'span';
  }

  return isExternal.value ? 'a' : RouterLink;
});

const componentAttrs = computed(() => {
  if (props.disabled) {
    return {
      role: 'link',
      tabindex: -1,
      'aria-disabled': 'true',
    };
  }

  if (isExternal.value) {
    return {
      href: props.href || '#',
      target: props.target || '_blank',
      rel: props.target === '_blank' ? 'noopener noreferrer' : undefined,
    };
  }

  return {
    to: props.href || '/',
    target: props.target || '_self',
  };
});

const variant = computed(() => VARIANT_STYLES[props.color] || VARIANT_STYLES.primary);

const rootClasses = computed(() => [
  'inline-flex items-center gap-2 font-medium transition-colors duration-150 outline-none',
  props.small ? 'text-sm' : 'text-base',
  props.underline ? 'underline underline-offset-4' : '',
  props.disabled ? 'cursor-default text-gray-700 opacity-60' : 'cursor-pointer',
  !props.disabled ? variant.value.text : '',
]);

const iconColor = computed(() => (props.disabled ? 'gray-600' : 'currentColor'));

const iconLeftClasses = computed(() => (props.small ? '' : ''));
const iconRightClasses = computed(() => (props.small ? '' : ''));

const computedIconSize = computed(() => (props.small ? '14' : '18'));
</script>
