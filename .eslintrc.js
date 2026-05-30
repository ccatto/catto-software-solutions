module.exports = {
  root: true,
  // Simplify the extends to avoid conflicts
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    '@typescript-eslint/no-unused-expressions': 'off', // Disable the problematic rule
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-unused-vars': 1,
    '@next/next/no-html-link-for-pages': 'off',
    'react-hooks/rules-of-hooks': 0,
    'no-return-await': 2,
    curly: 2,
    '@typescript-eslint/no-inferrable-types': [
      2,
      {
        ignoreParameters: true,
      },
    ],
  },
  ignorePatterns: ['**/node_modules/**', 'dist', '.next', 'out'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
};
