import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import jsoncParser from 'jsonc-eslint-parser';
import pluginJsonc from 'eslint-plugin-jsonc';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const allScripts = ['**/*.{js,jsx,mjs,ts,tsx,mts}'];

const stylisticConfig = stylistic.configs.customize({
    braceStyle: '1tbs',
    indent: 4,
    quotes: 'single',
    semi: true,
    jsx: true,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals'),

    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/prefer-readonly': 'warn',
            '@typescript-eslint/consistent-type-imports': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'warn',

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },

    {
        files: allScripts,
        ...stylisticConfig,
        rules: {
            ...stylisticConfig.rules,
            '@stylistic/max-statements-per-line': 'off',
            '@stylistic/space-before-function-paren': ['error', 'always'],
            '@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
            '@stylistic/jsx-quotes': ['error', 'prefer-single'],
        },
    },

    {
        files: allScripts,
        plugins: {
            jsdoc,
        },
        rules: {
            'jsdoc/sort-tags': 'warn',
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-hyphen-before-param-description': ['warn', 'never'],
            'jsdoc/no-defaults': 'off',
            'jsdoc/require-property-description': 'off',
        },
    },

    {
        files: ['**/*.json'],
        languageOptions: {
            parser: jsoncParser,
        },
        plugins: {
            jsonc: pluginJsonc,
        },
        rules: {
            'jsonc/indent': ['error', 4],
            'jsonc/quotes': ['error', 'double'],
        },
    },
];

export default eslintConfig;
