export function resolveColorTokenToCss(color) {
  const value = color == null ? '' : String(color).trim();

  if (!value) {
    return undefined;
  }

  if (value === 'currentColor') {
    return 'currentColor';
  }

  // Direct CSS colors
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
    return value;
  }

  // CSS variable name passed directly: --color-green-500
  if (value.startsWith('--color-')) {
    return `var(${value})`;
  }

  // Tailwind-like token: green-500 -> var(--color-green-500)
  if (/^[a-zA-Z]+-\d{2,3}$/.test(value)) {
    return `var(--color-${value})`;
  }

  // Fallback: return as-is (e.g., 'white')
  return value;
}
