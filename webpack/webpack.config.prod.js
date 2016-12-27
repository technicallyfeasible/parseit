const configure = require('./webpack.base.js');

module.exports = configure({
  environment: 'production',
  publicPath: '/release/'
});
