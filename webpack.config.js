const configure = require('./webpack.base');

module.exports = configure({
  environment: 'development',
  publicPath: '/release/'
});
