import { defineConfig } from 'typescript-eslint';

export default [
  {
    ignores: ['dist', 'build', 'node_modules'],
  },
  ...defineConfig({
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  }),
];
