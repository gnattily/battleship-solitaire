import nextPlugin from '@next/eslint-plugin-next';
import stylistic from '@stylistic/eslint-plugin';
import pluginJsonc from 'eslint-plugin-jsonc';
import * as jsoncParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

const allScripts = ['**/*.{js,jsx,mjs,ts,tsx,mts}'];
const stylisticConfig = stylistic.configs.customize({
    braceStyle: '1tbs',
    indent: 4,
    quotes: 'single',
    semi: true,
    jsx: true,
});

const eslintConfig = [
    {
        // copied from .gitignore
        ignores: [
            '.next/**',
            'node_modules/**',
            'coverage/**',
            'out/**',
            'build/**',
            '.pnp/**',
            'next-env.d.ts',
        ],
    },

    {
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },

    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
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
