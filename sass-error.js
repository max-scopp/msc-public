const sass = require('sass');

sass.renderSync({
  file: 'src/global.scss',
  includePaths: ['src/scss', 'node_modules'],
});