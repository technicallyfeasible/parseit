module.exports = {
  presets: [
    ['es2015', { modules: false }],
    'stage-0',
    'flow',
  ],
  plugins: [
    'transform-class-display-name',
    'transform-runtime',
  ],
  sourceMaps: true,
};
