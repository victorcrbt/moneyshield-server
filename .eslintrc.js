module.exports = {
  env: {
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '_',
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    'prettier/prettier': 'error',
    'arrow-parens': ['warn', 'as-needed'],
    camelcase: 'off',
    'comma-dangle': 'off',
    'class-methods-use-this': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        js: 'never',
      },
    ],
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    indent: 'off',
    'max-classes-per-file': 'off',
    'no-console': ['warn', { allow: ['error'] }],
    'no-else-return': 'off',
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    strict: 'off',
    'object-curly-newline': 'off',
  },
  settings: {
    'import/extensions': ['.ts', '.js'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
      node: {
        paths: ['node_modules', './src'],
        extensions: ['.ts', '.d.ts'],
      },
    },
  },
};
