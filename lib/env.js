const path = require('path');

module.exports = {
  DEFAULT_DIST_PATH: path.join(process.cwd(), 'dist'),
  DEFAULT_UCDEXT_PATH: path.join(process.cwd(), 'dist/ext.ucdext'),
  DEFAULT_STATIC_MANIFEST_PATH: path.join(process.cwd(), 'static/manifest.json'),
  DEFAULT_DIST_MANIFEST_PATH: path.join(process.cwd(), 'dist/manifest.json'),
};
