#!/usr/bin/env node

const config = require('./webpack.prod.js');
const { runWebpack } = require('./common');

runWebpack(config);
