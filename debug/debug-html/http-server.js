const http = require('http');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function serveDebugHttpService() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'debug.html')).pipe(res);
  });

  server.listen(8321);
  console.log(chalk.bgBlueBright('在线调试服务已打开, 请访问: http://localhost:8321'));
}

module.exports = {
  serveDebugHttpService,
};
