import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import jsoncParser from 'jsonc-eslint-parser';
import pluginJsonc from 'eslint-plugin-jsonc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

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
        files: ['**/*.{js,jsx,mjs,ts,tsx}'],
        ...stylisticConfig,
        rules: {
            ...stylisticConfig.rules,
            '@stylistic/max-statements-per-line': 'off',
            '@stylistic/space-before-function-paren': ['error', 'always'],
            '@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
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
