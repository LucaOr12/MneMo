import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

const unusedVars = ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }];

const noWeb = {
    group: ['@mnemo/web', '@mnemo/web/*', '**/apps/web/**'],
    message: 'Backend cannot depend from Frontend.',
};

const noApi = {
    group: ['@mnemo/api', '@mnemo/api/*', '**/apps/api/**'],
    message: 'Frontend cannot depend from Backend.',
}

const layer = (...forbidden) => ({
    'no-restricted-imports': [
        'error',
        { patterns: [noWeb, { group: forbidden, message: 'Dependency different from layers direction' }] },

    ],
});

export default [
    { ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'] },
    js.configs.recommended,
    { rules: { 'no-unused-vars': unusedVars } },

    // Backend, pacchetto condiviso e file di configurazione: ambiente Node.
    {
        files: ['apps/api/**/*.js', 'packages/**/*.js', '*.js'],
        languageOptions: { globals: globals.node },
    },

    // Frontend: ambiente browser + React.
    {
        files: ['apps/web/**/*.{js,jsx}'],
        plugins: { react, 'react-hooks': reactHooks },
        languageOptions: {
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        rules: {
            // Senza questa regola ESLint considera "non usato" un componente usato solo come <App />.
            'react/jsx-uses-vars': 'error',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'no-restricted-imports': ['error', { patterns: [noApi] }],
        },
    },

    // Strati del backend (le cartelle services/ e repositories/ nasceranno dopo: la regola è già pronta).
    { files: ['apps/api/src/routes/**'], rules: layer('../repositories/**', '../db/**') },
    { files: ['apps/api/src/services/**'], rules: layer('../routes/**', 'express') },
    { files: ['apps/api/src/repositories/**'], rules: layer('../routes/**', '../services/**', 'express') },
    // Il dominio è puro: niente HTTP, niente database, niente altri strati.
    {
        files: ['apps/api/src/domain/**'],
        rules: layer('express', 'pg', '../db/**', '../repositories/**', '../services/**', '../routes/**'),
    },

    // Sempre per ultimo: disattiva le regole di stile che confliggono con Prettier.
    prettier,
];