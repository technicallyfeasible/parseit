const configure = require('./webpack.base.js');

module.exports = configure({
  hot: true,
  environment: 'development',
  publicPath: '/js/',
});
