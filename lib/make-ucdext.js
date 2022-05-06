const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { DEFAULT_DIST_PATH, DEFAULT_UCDEXT_PATH, DEFAULT_DIST_MANIFEST_PATH } = require('./env');

function validateIcon(name) {
  return /^[a-z0-9_.@()-]+\.(png|svg|gif|jpg|jpeg)$/i.test(name);
}

/**
 * 获取 .ucdext 插件压缩包数据
 * 📢 注意: 会校验 icon 的名字, 如果是一个文件名, 读取这个Icon , http base64 等其他 则忽略
 * @param {string} distPath ["dist"] dist 目录
 */
function getUCDEXT(distPath = DEFAULT_DIST_PATH) {
  const zip = new AdmZip();
  const manifestPath = path.join(distPath, 'manifest.json');
  zip.addLocalFile(manifestPath);
  const manifest = getManifest(manifestPath);
  if (validateIcon(manifest.icon)) {
    zip.addLocalFile(path.join(distPath, manifest.icon));
  }
  zip.addLocalFile(path.join(distPath, 'main.js'));
  return zip;
}

/**
 * 生成 .ucdext 插件压缩包
 * @param {string} distPath ["dist"] dist 目录
 * @param {string} targetExtPath ["dist/ext.ucdext"]
 */
function writeUCDEXT(distPath = DEFAULT_DIST_PATH, targetExtPath = DEFAULT_UCDEXT_PATH) {
  const zip = getUCDEXT(distPath);
  zip.writeZip(targetExtPath);
  return zip;
}

function getManifest(manifestJsonPath = DEFAULT_DIST_MANIFEST_PATH) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestJsonPath).toString());
    return manifest;
  } catch (e) {
    console.error(chalk.redBright('获取 manifest 失败', e));
  }
}

module.exports = {
  getUCDEXT,
  writeUCDEXT,
  getManifest,
};
