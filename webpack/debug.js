#!/usr/bin/env node

const config = require('./webpack.debug.js');
const { runWebpack } = require('./common');

runWebpack(config);
