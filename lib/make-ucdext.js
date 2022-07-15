const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const {
  DEFAULT_DIST_PATH,
  DEFAULT_UCDEXT_PATH,
  DEFAULT_DIST_MANIFEST_PATH,
  DEFAULT_STATIC_PATH,
  DEFAULT_STATIC_MANIFEST_PATH,
  DEFAULT_I18N_DIST_PATH,
} = require('./env');

function validateIcon(name) {
  return /^[a-z0-9_.@()-]+\.(png|svg|gif|jpg|jpeg)$/i.test(name);
}

/**
 * 获取 .ucdext 插件压缩包数据
 * 📢 注意: 会校验 icon 的名字, 如果是一个文件名, 读取这个Icon , http base64 等其他 则忽略
 * @param {object} manifestJson Manifest 的 Object
 * @param {string} distPath ["dist"] dist 目录
 * @param {string} manifestPath manifestPath
 */
function getUCDEXT(
  manifestJson,
  distPath = DEFAULT_DIST_PATH,
  manifestPath = DEFAULT_STATIC_MANIFEST_PATH,
  i18nPath = DEFAULT_I18N_DIST_PATH
) {
  const zip = new AdmZip();
  // const manifestPath = path.join(distPath, 'manifest.json');
  zip.addLocalFile(manifestPath);
  if (validateIcon(manifestJson.icon)) {
    const iconPath = path.join(distPath, manifestJson.icon);
    try {
      zip.addLocalFile(iconPath);
    } catch (e) {
      console.log(chalk.red(`生成 ucdext 失败, 找不到 icon 或者读取失败: ${iconPath}`));
      console.log(e);
      throw e;
    }
  }
  const entryJsPath = path.join(distPath, 'main.js');
  try {
    zip.addLocalFile(entryJsPath);
  } catch (e) {
    console.log(chalk.red(`生成 ucdext 失败, 找不到 main.js 或者读取失败: ${entryJsPath}`));
    console.log(e);
    throw e;
  }
  try {
    zip.addLocalFolder(i18nPath, 'i18n');
  } catch (e) {
    console.log(chalk.red(`翻译文件打包失败: ${i18nPath}`));
    console.log(e);
  }
  return zip;
}

/**
 * 生成 .ucdext 插件压缩包
 * @param {object} manifestJson Manifest 的 Object
 * @param {string} manifestPath manifestPath
 * @param {string} distPath ["dist"] dist 目录
 * @param {string} targetExtPath ["dist/ext.ucdext"]
 */
function writeUCDEXT(
  manifestJson,
  distPath = DEFAULT_DIST_PATH,
  manifestPath = DEFAULT_STATIC_MANIFEST_PATH,
  targetExtPath = DEFAULT_UCDEXT_PATH
) {
  const zip = getUCDEXT(manifestJson, distPath, manifestPath);
  zip.writeZip(targetExtPath);
  return zip;
}

/**
 * 获取 Manifest
 * @param {string} manifestJsonPath 路径
 * @returns
 */
function getManifest(manifestJsonPath = DEFAULT_DIST_MANIFEST_PATH) {
  return new Promise((resolve, reject) => {
    fs.readFile(manifestJsonPath, (err, data) => {
      if (err) {
        console.log(chalk.red(`Manifest 读取失败 ${manifestJsonPath}`));
        console.error(err);
        reject(err);
      } else {
        try {
          resolve(JSON.parse(data.toString()));
        } catch (e) {
          console.log(chalk.red('解析 Manifest 失败, 请确保它是一个合法的 JSON 文件 (需符合 JSON 规范)'));
          console.error(err);
        }
      }
    });
  });
}

/**
 * 获取 Manifest 同步
 * @param {string} manifestJsonPath 路径
 * @returns
 */
function getManifestSync(manifestJsonPath = DEFAULT_DIST_MANIFEST_PATH) {
  let data;
  try {
    data = fs.readFileSync(manifestJsonPath);
  } catch (err) {
    console.log(chalk.red(`Manifest 读取失败 ${manifestJsonPath}`));
    console.error(err);
    return undefined;
  }
  try {
    return JSON.parse(data.toString());
  } catch (err) {
    console.log(chalk.red('解析 Manifest 失败, 请确保它是一个合法的 JSON 文件 (需符合 JSON 规范)'));
    console.error(err);
  }
}

/**
 * 拷贝 icon
 * @param {object} manifestJson Manifest 的 Object
 * @param {string} staticPath static 路径
 * @returns
 */
function copyManifestIcon(manifestJson, staticPath = DEFAULT_STATIC_PATH, distPath = DEFAULT_DIST_PATH) {
  return new Promise((resolve, reject) => {
    if (validateIcon(manifestJson.icon)) {
      console.log(chalk.blue(`Manifest icon 使用了本地文件: ${manifestJson.icon}`));
      const iconSrcPath = path.join(staticPath, manifestJson.icon);
      const iconDestPath = path.join(distPath, manifestJson.icon);
      fs.copyFile(iconSrcPath, iconDestPath, (err) => {
        if (err) {
          console.log(chalk.red('拷贝 manifest icon 失败, 请确认 图标文件是否存在, 或者 manifest icon 路径是否正确'));
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      console.log(chalk.blue('使用非本地的图标文件, 跳过拷贝 Manifest ICon'));
      resolve();
    }
  });
}

module.exports = {
  getUCDEXT,
  writeUCDEXT,
  getManifest,
  getManifestSync,
  copyManifestIcon,
};
