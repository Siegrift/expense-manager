module.exports = {
  root: true,
  plugins: ['cypress'],
  env: {
    'cypress/globals': true,
  },
  extends: ['../.eslintrc.base.js', 'plugin:cypress/recommended'],
}
