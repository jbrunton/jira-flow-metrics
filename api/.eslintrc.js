module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'boundaries'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:boundaries/strict',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: 'entities',
            allow: ['entities'],
          },
          {
            from: 'usecases',
            allow: ['entities', 'usecases'],
          },
          {
            from: 'data',
            allow: ['entities', 'usecases', 'data'],
          },
          {
            from: 'app',
            allow: ['entities', 'usecases', 'app'],
          },
          {
            from: 'main',
            allow: ['app', 'data', 'main'],
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    'boundaries/elements': [
      {
        type: 'entities',
        pattern: 'src/domain/entities',
      },
      {
        type: 'usecases',
        pattern: 'src/domain/usecases',
      },
      {
        type: 'data',
        pattern: 'src/data',
      },
      {
        type: 'app',
        pattern: ['src/app'],
      },
      {
        type: 'main',
        pattern: ['src/main.ts', 'src/main-module.ts'],
        mode: 'file',
      },
    ],
    'boundaries/ignore': [
      '**/*.spec.ts',
      '**/*.e2e-spec.ts',
      'test/**',
    ],
  },
};
