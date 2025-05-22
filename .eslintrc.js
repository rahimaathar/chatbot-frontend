module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'react-app',
        'react-app/jest',
    ],
    rules: {
        'no-unused-vars': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}; 