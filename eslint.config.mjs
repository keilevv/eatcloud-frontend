import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
    },
  },
]);

export default eslintConfig;
