module.exports = {
  extends: [
    'eslint-config-qiwi',
    'prettier',
  ],
  overrides: [
    {
      files: ['./src/test/**/*.ts'],
      rules: {
        'unicorn/consistent-function-scoping': 'off',
        'sonarjs/no-duplicate-string': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      }
    }
  ]
};
