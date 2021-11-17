module.exports = {
  env: {
    jest: true,
  },
  extends: [
    './.eslintrc.base.js',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:jest-formatting/recommended',
  ],
}
