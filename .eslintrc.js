module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: 'airbnb',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2015,
        sourceType: 'module',
    },
    plugins: [
        'react', 'fs',"react-security", "no-unsanitized"
    ],
    rules: {
        'indent': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/prop-types': [0],
        'react/no-array-index-key': [0],
        'react/forbid-prop-types': [0],
        'react/no-danger': [0],
        'react/require-default-props': [0],
        'no-shadow': [0],
        // [Deprecated], https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
        'jsx-a11y/label-has-for': [0],
        'jsx-a11y/label-has-associated-control': [2, { 'assert': 'either' }],
        'react/jsx-props-no-spreading': [0],
        'react/jsx-fragments': ['error', 'element'],
         // https://github.com/mozilla/eslint-plugin-no-unsanitized
        "no-unsanitized/method": "error",
        "no-unsanitized/property": "error",
    },
};
