module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@store': './src/store',
            '@lib': './src/lib',
            '@theme': './src/theme',
            '@db': './src/db',
            '@data': './src/data',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
