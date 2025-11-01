module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@services': './src/lib/services',
          '@storage': './src/lib/storage',
          '@components': './src/lib/components',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};
