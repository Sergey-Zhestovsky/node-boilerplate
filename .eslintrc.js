const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  reportUnusedDisableDirectives: true,

  env: {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'jest/globals': true,
  },

  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier', 'plugin:jest/recommended'],

  plugins: ['jest', 'jsdoc'],

  parserOptions: {
    ecmaVersion: 12,
  },

  rules: {
    'accessor-pairs': OFF,
    'array-bracket-newline': [ERROR, 'consistent'],
    'array-bracket-spacing': [ERROR, 'never'],
    'array-callback-return': ERROR,
    'array-element-newline': [ERROR, 'consistent'],
    'arrow-body-style': OFF, // [ERROR, 'as-needed']
    'arrow-parens': ERROR,
    'arrow-spacing': ERROR,
    'block-spacing': ERROR,
    'brace-style': [ERROR, '1tbs'],
    'camelcase': [ERROR, { ignoreDestructuring: true }],
    'class-methods-use-this': OFF,
    'comma-dangle': [
      ERROR,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'comma-spacing': OFF,
    'comma-style': ERROR,
    'computed-property-spacing': ERROR,
    'consistent-return': OFF,
    'curly': [ERROR, 'multi-line'],
    'default-param-last': ERROR,
    'dot-location': [ERROR, 'property'],
    'dot-notation': [ERROR, { allowPattern: '^(error|warn)$' }],
    'eol-last': ERROR,
    'eqeqeq': [ERROR, 'allow-null'],
    'func-call-spacing': OFF,
    'function-call-argument-newline': [ERROR, 'consistent'],
    'grouped-accessor-pairs': [ERROR, 'getBeforeSet'],
    'handle-callback-err': [ERROR, '^.*(e|E)rr'],
    'implicit-arrow-linebreak': ERROR,
    'indent': OFF,
    'jsdoc/no-undefined-types': WARN,
    'key-spacing': OFF,
    'keyword-spacing': [ERROR, { after: true, before: true }],
    'linebreak-style': ERROR,
    'lines-around-comment': OFF, // [ERROR, { allowBlockEnd: false, allowObjectEnd: false, allowArrayEnd: false, allowClassEnd: false }]
    'lines-between-class-members': ERROR,
    'max-classes-per-file': OFF, // [ERROR, 1]
    'max-len': OFF,
    'max-params': [ERROR, 10],
    'max-statements-per-line': ERROR,
    'new-cap': [ERROR, { properties: false }],
    'newline-per-chained-call': [ERROR, { ignoreChainWithDepth: 3 }],
    'no-async-promise-executor': ERROR,
    'no-await-in-loop': ERROR,
    'no-bitwise': OFF,
    'no-buffer-constructor': ERROR,
    'no-compare-neg-zero': ERROR,
    'no-cond-assign': [ERROR, 'except-parens'],
    'no-confusing-arrow': ERROR,
    'no-console': ERROR,
    'no-constant-condition': [ERROR, { checkLoops: false }],
    'no-constructor-return': ERROR,
    'no-duplicate-imports': ERROR,
    'no-else-return': ERROR,
    'no-empty-function': WARN,
    'no-eq-null': ERROR,
    'no-extend-native': ERROR,
    'no-extra-bind': ERROR,
    'no-extra-label': ERROR,
    'no-extra-parens': OFF,
    'no-extra-semi': ERROR,
    'no-fallthrough': ERROR,
    'no-floating-decimal': ERROR,
    'no-implied-eval': ERROR,
    'no-inline-comments': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-invalid-this': OFF,
    'no-iterator': ERROR,
    'no-labels': ERROR,
    'no-lone-blocks': ERROR,
    'no-loop-func': ERROR,
    'no-magic-numbers': OFF,
    'no-mixed-requires': ERROR,
    'no-mixed-spaces-and-tabs': ERROR,
    'no-multi-assign': ERROR,
    'no-multi-spaces': ERROR,
    'no-multiple-empty-lines': ERROR,
    'no-negated-condition': ERROR,
    'no-new': ERROR,
    'no-new-func': ERROR,
    'no-new-require': ERROR,
    'no-new-symbol': ERROR,
    'no-new-wrappers': ERROR,
    'no-octal-escape': ERROR,
    'no-param-reassign': [ERROR, { props: false }],
    'no-path-concat': ERROR,
    'no-process-exit': OFF,
    'no-proto': ERROR,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-return-assign': [ERROR, 'except-parens'],
    'no-return-await': ERROR,
    'no-self-assign': ERROR,
    'no-self-compare': ERROR,
    'no-shadow': WARN,
    'no-tabs': ERROR,
    'no-throw-literal': ERROR,
    'no-trailing-spaces': ERROR,
    'no-undef-init': ERROR,
    'no-undefined': OFF,
    'no-underscore-dangle': ERROR,
    'no-unmodified-loop-condition': ERROR,
    'no-unneeded-ternary': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, { args: 'none' }],
    'no-use-before-define': ERROR,
    'no-useless-call': ERROR,
    'no-useless-computed-key': ERROR,
    'no-useless-concat': ERROR,
    'no-useless-constructor': OFF,
    'no-useless-escape': ERROR,
    'no-useless-rename': ERROR,
    'no-useless-return': ERROR,
    'no-var': ERROR,
    'no-whitespace-before-property': ERROR,
    'object-curly-newline': [ERROR, { consistent: true }],
    'object-curly-spacing': [ERROR, 'always'],
    'operator-linebreak': [ERROR, 'none', { overrides: { '?': 'before', ':': 'before' } }],
    'padded-blocks': [ERROR, 'never'],
    'padding-line-between-statements': [
      ERROR,
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'case' },
      { blankLine: 'any', prev: 'block-like', next: 'case' },
    ],
    'prefer-const': ERROR,
    'prefer-destructuring': OFF,
    'prefer-named-capture-group': OFF,
    'prefer-object-spread': ERROR,
    'prefer-promise-reject-errors': ERROR,
    'prefer-regex-literals': ERROR,
    'prefer-rest-params': ERROR,
    'prefer-spread': ERROR,
    'prefer-template': ERROR,
    'quote-props': [ERROR, 'consistent'],
    'quotes': [WARN, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'require-await': OFF,
    'rest-spread-spacing': ERROR,
    'semi': ERROR,
    'semi-spacing': ERROR,
    'semi-style': ERROR,
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
    'space-in-parens': ERROR,
    'space-infix-ops': ERROR,
    'space-unary-ops': [ERROR, { words: true, nonwords: false }],
    'spaced-comment': [ERROR, 'always', { markers: ['/'] }],
    'symbol-description': ERROR,
    'template-curly-spacing': ERROR,
    'valid-typeof': [ERROR, { requireStringLiterals: true }],
    'yoda': ERROR,
  },

  overrides: [
    {
      files: '**/*.test.js',
      rules: {
        'node/no-unpublished-require': OFF,
        'node/no-missing-require': OFF,
      },
    },
  ],
};
