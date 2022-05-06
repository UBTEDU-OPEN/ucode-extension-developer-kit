const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DEFAULT_STATIC_MANIFEST_PATH } = require('../lib/env');
const validateManifest = require('../validate');
const { writeUCDEXT, getManifest } = require('../lib/make-ucdext');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          validateManifest(getManifest(DEFAULT_STATIC_MANIFEST_PATH));
          writeUCDEXT();
        });
      },
    },
  ],
});
