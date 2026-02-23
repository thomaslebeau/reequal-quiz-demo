import type { ThemeDefinition } from 'vuetify'

export const reequal: ThemeDefinition = {
  dark: false,
  colors: {
    'primary': '#2D1B69',
    'primary-darken-1': '#1E1147',
    'secondary': '#F5A623',
    'secondary-darken-1': '#D98E1B',
    'background': '#FFF5E0',
    'surface': '#FFFFFF',
    'error': '#E53935',
    'success': '#43A047',
    'warning': '#FB8C00',
    'info': '#1E88E5',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-background': '#2D1B69',
    'on-surface': '#333333',
    'on-error': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#FFFFFF',
    'on-info': '#FFFFFF',
  },
  variables: {
    'border-color': '#E0D6F2',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.6,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.08,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#333333',
  },
}

export const defaults = {
  VCard: {
    rounded: 'xl',
    elevation: 2,
  },
  VBtn: {
    rounded: 'lg',
  },
  VTextField: {
    variant: 'outlined' as const,
    rounded: 'lg',
    color: 'primary',
  },
  VTextarea: {
    variant: 'outlined' as const,
    rounded: 'lg',
    color: 'primary',
  },
  VSelect: {
    variant: 'outlined' as const,
    rounded: 'lg',
    color: 'primary',
  },
  VCheckbox: {
    color: 'success',
  },
  VDivider: {
    color: 'primary',
    opacity: 0.15,
  },
}
