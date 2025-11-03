module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
          '@helpers': './src/lib/helpers',
          '@services': './src/lib/services',
          '@storage': './src/lib/storage',
          '@components': './src/components',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};
