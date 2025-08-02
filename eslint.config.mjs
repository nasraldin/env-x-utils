import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const tsConfig = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
);

const config = [
  ...tsConfig,
  ...compat.extends('prettier'),
  pluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,ts}'],
    rules: {
      'no-console': 'off',
      'no-duplicate-imports': 'error',
      'no-empty-function': 'warn',
      'no-empty-pattern': 'warn',
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-object-type': [
        1,
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
    },
  },
  {
    ignores: ['node_modules', '.history', 'dist'],
  },
];

export default config;
