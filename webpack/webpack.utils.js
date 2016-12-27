const fs = require('fs');

function getNodeModules() {
  const nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => {
      nodeModules[mod] = `commonjs ${mod}`;
    });
  return nodeModules;
}

function getModuleFiles(module, exclude) {
  const include = /\.js$/g;
  const files = fs.readdirSync(`node_modules/${module}`)
    .map(name => `${module}/${name}`);
  return files.filter(name => name.match(include) && !name.match(exclude));
}

module.exports = {
  getNodeModules,
  getModuleFiles,
};
