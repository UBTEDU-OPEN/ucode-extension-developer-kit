const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { debugServer, serveDebugHttpService } = require('../debug');

serveDebugHttpService();

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          debugServer.installExtension();
        });
      },
    },
  ],
});
