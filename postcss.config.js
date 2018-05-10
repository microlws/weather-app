module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: [
        'last 2 versions',
        'ie >= 10',
        '> 5%',
      ],
    },
    'postcss-inline-svg': {
      path: './src',
    },
  },
};




