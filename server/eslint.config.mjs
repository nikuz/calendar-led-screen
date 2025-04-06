import js from '@eslint/js';
import solid from 'eslint-plugin-solid/configs/typescript';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import * as tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        ignores: ['**/server-build/'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            ...solid.plugins,
            '@typescript-eslint': tsPlugin,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error'],
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'object-shorthand': 'error',
            'quotes': ['error', 'single'],
            'quote-props': ['error', 'as-needed'],
            'no-param-reassign': 'error',
        },
    }
];