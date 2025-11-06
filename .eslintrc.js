const baseConfig = require('@react-native/eslint-config');

module.exports = {
  ...baseConfig,
  extends: ['plugin:react-hooks/recommended'],
  rules: {
    ...baseConfig.rules,
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
  },
  overrides: baseConfig.overrides.filter(
    o => !(o.env && o.env['jest/globals']),
  ),
};
