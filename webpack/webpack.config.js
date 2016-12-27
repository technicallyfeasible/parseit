const configure = require('./webpack.base.js');

module.exports = configure({
  environment: 'development',
  publicPath: '/release/'
});
