const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const chalk = require('chalk');

function mergeConfig(config) {
  const mergeConfigPath = path.join(process.cwd(), 'webpack.config.js');
  try {
    const mergeConfig = require(mergeConfigPath);
    console.log(chalk.blue('检测到 webpack.config.js, 将会使用 webpack-merge'));
    return merge(config, mergeConfig);
  } catch (e) {
    return config;
  }
}

function runWebpack(config) {
  const _config = mergeConfig(config);
  webpack(_config, (err, stats) => {
    // [Stats Object](#stats-object)
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    console.log(
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
      })
    );
  });
}

module.exports = { runWebpack };
