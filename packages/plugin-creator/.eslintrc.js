module.exports = {
  extends: [
    'eslint-config-qiwi',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  overrides: [
    {
      files: ['./src/test/**/*.ts'],
      rules: {
        'unicorn/consistent-function-scoping': 'off'
      }
    }
  ]
};
