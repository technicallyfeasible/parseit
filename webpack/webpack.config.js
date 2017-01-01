const configure = require('./webpack.base.js').default;

module.exports = configure({
  environment: 'development',
  publicPath: '/release/',
});
