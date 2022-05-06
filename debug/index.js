const { debugServer } = require('./debug-server');
const { serveDebugHttpService } = require('./debug-html/http-server');

module.exports = {
  debugServer,
  serveDebugHttpService,
};
