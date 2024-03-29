module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
    worker: true,
  },
  extends: [
    'eslint:all',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
  ],
  ignorePatterns: ['*.d.ts'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
  ],
  root: true,
  rules: {
    'array-bracket-newline': ['error', 'consistent'],
    'array-element-newline': ['error', 'consistent'],
    'arrow-body-style': ['error', 'always'],
    'camelcase': ['error', { properties: 'never' }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      exports: 'never',
      functions: 'never',
      imports: 'never',
      objects: 'always-multiline',
    }],
    'consistent-return': 'off',
    'complexity': ['error', 40],
    'default-case': 'off',
    'dot-location': ['error', 'property'],
    'function-call-argument-newline': ['error', 'consistent'],
    'id-length': 'off',
    'indent': ['error', 2],
    'init-declarations': 'off',
    'linebreak-style': ['error', 'unix'],
    'lines-around-comment': 'off',
    'max-len': ['error', { code: 100 }],
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'max-params': 'off',
    'max-statements': 'off',
    'multiline-ternary': ['error', 'always-multiline'],
    'no-bitwise': 'off',
    'no-continue': 'off',
    'no-extra-parens': 'off',
    'no-magic-numbers': 'off',
    'no-shadow': 'off',
    'no-ternary': 'off',
    'no-undefined': 'off',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
    'one-var': ['error', 'never'],
    'padded-blocks': ['error', 'never'],
    'prefer-destructuring': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': 'always'
  },
}
