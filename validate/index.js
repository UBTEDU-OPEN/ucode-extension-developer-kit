const Ajv = require('ajv');
const schema = require('./manifest_schema.json');
const chalk = require('chalk');

function validateManifest(input) {
  const ajv = new Ajv();

  const validate = ajv.compile(schema);

  const valid = validate(input);

  if (!valid) {
    console.log(chalk.redBright(validate.errors));
    throw new Error('Manifest 校验出错');
  } else {
    console.log(chalk.blue('Manifest 校验成功'));
  }
}

module.exports = validateManifest;
