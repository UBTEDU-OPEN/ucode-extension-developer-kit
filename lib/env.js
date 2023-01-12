const path = require('path');

const CURRENT_PATH = process.cwd();

const DEFAULT_DIST_PATH = path.join(CURRENT_PATH, 'dist');
const DEFAULT_UCDEXT_PATH = path.join(CURRENT_PATH, 'dist/ext.ucdext');
const DEFAULT_STATIC_MANIFEST_PATH = path.join(CURRENT_PATH, 'static/manifest.json');
const DEFAULT_STATIC_PATH = path.join(CURRENT_PATH, 'static');
const DEFAULT_DIST_MANIFEST_PATH = path.join(CURRENT_PATH, 'dist/manifest.json');
const DEFAULT_I18N_PATH = path.join(CURRENT_PATH, 'i18n');
const DEFAULT_I18N_SOURCE_PATH = path.join(DEFAULT_I18N_PATH, 'source');
const DEFAULT_I18N_DIST_PATH = path.join(DEFAULT_I18N_PATH, 'dist');
const DEFAULT_I18N_MESSAGE_SOURCE_PATH = path.join(CURRENT_PATH, 'src/**/*.{js,ts,jsx,tsx}');

module.exports = {
  DEFAULT_DIST_PATH,
  DEFAULT_UCDEXT_PATH,
  DEFAULT_STATIC_MANIFEST_PATH,
  DEFAULT_STATIC_PATH,
  DEFAULT_DIST_MANIFEST_PATH,
  DEFAULT_I18N_PATH,
  DEFAULT_I18N_SOURCE_PATH,
  DEFAULT_I18N_DIST_PATH,
  DEFAULT_I18N_MESSAGE_SOURCE_PATH,
};
