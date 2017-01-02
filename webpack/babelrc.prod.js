module.exports = {
  presets: [
    ['es2015', { modules: false }],
    'stage-0',
  ],
  plugins: [
    'transform-runtime',
    'transform-class-display-name',
  ],
  sourceMaps: true,
};
