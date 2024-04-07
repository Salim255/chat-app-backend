module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // other rules
    'no-undef': 'off', // or 'warn' to show warnings instead of errors,
    semi: 'off',
    'comma-dangle': ['error', 'always-multiline']
  }
}
