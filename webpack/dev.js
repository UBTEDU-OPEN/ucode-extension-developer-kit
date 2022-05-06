#!/usr/bin/env node

const config = require('./webpack.dev.js');
const { runWebpack } = require('./common');

runWebpack(config);
