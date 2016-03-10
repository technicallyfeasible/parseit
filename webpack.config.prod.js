const configure = require('./webpack.base');

module.exports = configure({
  environment: 'production',
  publicPath: '/release/'
});
