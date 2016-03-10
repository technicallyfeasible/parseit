const configure = require('./webpack.base');

module.exports = configure({
  hot: true,
  environment: 'development',
  publicPath: '/js/',
});
