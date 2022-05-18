const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const validateManifest = require('../validate');
const { writeUCDEXT, getManifest, copyManifestIcon } = require('../lib/make-ucdext');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          getManifest().then((manifest) => {
            copyManifestIcon(manifest)
              .then(() => {
                validateManifest(manifest);
                writeUCDEXT(manifest);
              })
              .catch((err) => process.exit(-1));
          });
        });
      },
    },
  ],
});
