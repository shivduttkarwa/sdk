import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: [
      'docs',
      'dist',
      'node_modules',
      'public',
      'original-static',
      'playwright-report',
      'test-results',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { window: 'readonly', document: 'readonly' },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Verbatim imperative cores (WebGL/GSAP) copied byte-for-byte from the original site.
    // Pragmatic `any` for opaque GL objects and empty catch blocks (swallowing GL-teardown
    // errors) are intentional here (see plan); do not relint them.
    files: ['src/cores/**/*.ts', 'src/shaders/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty': 'off',
      'prefer-const': 'off',
    },
  },
  {
    // The `[]`-deps hooks carry defensive exhaustive-deps directives that don't always fire.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
  },
);
