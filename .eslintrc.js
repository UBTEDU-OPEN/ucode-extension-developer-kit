module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['prettier', 'jest'],
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': 'error',
    'no-useless-escape': 'off',
    'no-useless-concat': 'off',
    indent: 'off',
    'max-len': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-unused-vars': 'off',
  },
};
