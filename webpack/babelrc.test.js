module.exports = {
  presets: [
    ['es2015', { modules: false }],
    'stage-0',
    'flow',
  ],
  plugins: [
    'transform-class-display-name',
    'rewire',
    'transform-runtime',
  ],
  sourceMaps: true,
};
