// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      'logs/**',
      'dist/**',
      'prisma/migrations/**',
      '.env*',
      'package-lock.json',
      'yarn.lock',
      '*.log',
    ],
  },

  js.configs.recommended,

  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  prettierConfig,
];
