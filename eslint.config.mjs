import { defineFlatConfig } from 'eslint-define-config'
import nextPlugin from '@next/eslint-plugin-next'

export default defineFlatConfig([
  {
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      // Your custom rules
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'react/jsx-key': 'error'
    },
    settings: {
      next: {
        rootDir: '.'
      }
    },
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'public/',
      '*.config.js',
      '*.config.mjs'
    ]
  }
])