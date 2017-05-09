const configure = require('./webpack.base.js').default;

module.exports = configure({
  hot: true,
  // environment: 'development',
  environment: 'development',
  publicPath: '/js/',
});
