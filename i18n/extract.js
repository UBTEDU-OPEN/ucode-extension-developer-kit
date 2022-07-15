#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { program } = require('commander');
const chalk = require('chalk');
const { DEFAULT_I18N_PATH, DEFAULT_STATIC_MANIFEST_PATH, DEFAULT_I18N_MESSAGE_SOURCE_PATH } = require('../lib/env');

program.option('-l, --locale <locale>', 'provide locale', 'zh-cn');
program.option('-o, --output <path>', 'i18n extract output path', DEFAULT_I18N_PATH);
program.option('-i, --input <path>', 'message i18n input path', DEFAULT_I18N_MESSAGE_SOURCE_PATH);
program.option('-m, --manifest <path>', 'manifest input path', DEFAULT_STATIC_MANIFEST_PATH);
program.option('-c, --compile', 'Enable compile message with formatjs', true);

program.parse();

const options = program.opts();

console.log(chalk.blue('接收的参数: '));
console.log(options);

function extractFormatJsMessages(inputPath, outputPath) {
  const cmd = `npx formatjs extract --extract-source-location true --out-file ${outputPath} ${inputPath}`;
  console.log(chalk.cyan(cmd));
  const output = execSync(cmd);
  console.log(output.toString());
}

function compileMessages(inputPath, outputPath) {
  const cmd = `npx formatjs compile --out-file ${outputPath} ${inputPath}`;
  console.log(chalk.cyan(cmd));
  const output = execSync(cmd);
  console.log(output.toString());
}

function extractManifestIntlMessages(manifest) {
  const manifestMessage = {};
  if (manifest.name && typeof manifest.name === 'object') {
    manifestMessage[manifest.name.id] = manifest.name;
  }
  if (manifest.author && typeof manifest.author === 'object') {
    manifestMessage[manifest.author.id] = manifest.author;
  }
  if (manifest.description && typeof manifest.description === 'object') {
    manifestMessage[manifest.description.id] = manifest.description;
  }
  return manifestMessage;
}

/** 获取 Manifest 里面的翻译 */
const Manifest = require(options.manifest);
const manifestMessages = extractManifestIntlMessages(Manifest);
console.log(chalk.blue('manifest.json 翻译提取: '));
console.log(manifestMessages);

/* 提取的临时的翻译 路径 i18n/source/zh-cn.json */
const outputRawJsonFilePath = path.join(options.output, 'source', `${options.locale}.json`);

/* 调用 formatjs extract 提取 message.ts 的翻译 */
extractFormatJsMessages(options.input, outputRawJsonFilePath);

/* 合并 manifest.json 和 message.ts 的翻译 */
let outputRawJson = JSON.parse(fs.readFileSync(outputRawJsonFilePath).toString());
outputRawJson = {
  ...manifestMessages,
  ...outputRawJson,
};

fs.writeFileSync(outputRawJsonFilePath, JSON.stringify(outputRawJson, null, 2));

/* 调用 formatjs compile 转换最终翻译结果 */
if (options.compile) {
  const outputCompileJsonFilePath = path.join(options.output, 'dist', `${options.locale}.json`);
  compileMessages(outputRawJsonFilePath, outputCompileJsonFilePath);
}
