const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },

  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],

  parserOptions: {
    ecmaVersion: 12,
  },

  rules: {
    'accessor-pairs': OFF,
    'brace-style': [ERROR, '1tbs'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    'dot-notation': [ERROR, { allowPattern: '^(error|warn)$' }],
    'eol-last': ERROR,
    eqeqeq: [ERROR, 'allow-null'],
    indent: OFF,
    'keyword-spacing': [ERROR, { after: true, before: true }],
    'no-bitwise': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': WARN,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': WARN,
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, { args: 'none' }],
    'no-useless-concat': OFF,
    quotes: [WARN, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
    'valid-typeof': [ERROR, { requireStringLiterals: true }],
    'no-var': ERROR,
    'max-len': OFF,
  },
};
