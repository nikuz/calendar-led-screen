import js from '@eslint/js';
import solid from 'eslint-plugin-solid/configs/typescript';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import * as tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        ignores: ['**/dist/'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            ...solid.plugins,
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...solid.rules,
            '@typescript-eslint/no-unused-vars': ['error'],
            'no-unused-vars': 'off',
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.app.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
            }
        },
    },
    {
        files: ['vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            }
        },
    }
];