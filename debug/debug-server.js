/**
 * 调试服务器
 */
const { WebSocketServer } = require('ws');
const { getUCDEXT, getManifest } = require('../lib/make-ucdext');
const url = require('url');
const chalk = require('chalk');

const logger = (...args) => console.log(chalk.blueBright(...args));

class DebugServer {
  constructor(port) {
    this._port = 9321;
    this.wss = null;
    this.clients = new Map();
    this.debugClient = null;
    if (typeof port === 'string') {
      const convertPort = Number(port);
      if (!Number.isNaN(convertPort)) {
        this._port = convertPort;
      }
    } else if (typeof port === 'number') {
      this._port = port;
    }
    this.initWS();
  }

  getSocketId(req) {
    const parsedUrl = url.parse(req.url, true, true);
    let id = null;
    if (parsedUrl.query) {
      if (parsedUrl.query.type === 'debug') {
        id = 'debug';
        logger('调试页面 已连接');
      } else if (parsedUrl.query.type === 'ucode' && parsedUrl.query.id) {
        id = Buffer.from(parsedUrl.query.id, 'base64').toString();
        logger('uCode 调试接口已连接: ', id);
      }
    } else {
      logger('uCode 调试接口已连接: ', req.socket.remoteAddress);
    }
    return id;
  }

  initWS() {
    const wss = new WebSocketServer({
      port: this._port,
    });
    this.wss = wss;
    logger('插件调试服务已打开, 端口号: ', this._port);
    wss.on('connection', (ws, req) => {
      const id = this.getSocketId(req);
      if (id === 'debug') {
        this.debugClient = ws;
      } else {
        this.clients.set(ws, id);
      }
      this.debugClient?.send(
        JSON.stringify({
          cmd: 'clientList',
          data: Array.from(this.clients.values()),
        })
      );
      ws.on('message', (rawData) => {
        const msg = rawData.toString();
        logger('接收到消息: ', msg);
        try {
          const d = JSON.parse(msg);
          this.messageCallback(ws, d, id);
        } catch (e) {
          console.error(chalk.redBright(`转换消息发生错误: ${e}`));
        }
      });
      ws.on('close', () => {
        logger('断开连接: ', id);
        this.clients.delete(ws);
        if (id === 'debug') {
          this.debugClient = null;
        }
      });
    });
  }

  messageCallback(client, msg, id) {
    switch (msg.cmd) {
      case 'install':
        if (id === 'debug') {
          // 调试页面发出来的, 往全部发
          this.installExtension();
        } else {
          this.installExtension(client);
        }
        break;
    }
  }

  sendDebugCommand(client, cmd, data) {
    logger('发送 调试', cmd);
    //  this.wss.clients.forEach((ws) => ));
    client.send(
      JSON.stringify({
        cmd,
        data,
      })
    );
  }

  sendAllDebugCommand(cmd, data) {
    logger('给所有 客户端 发送 调试', cmd);
    this.wss.clients.forEach((ws) =>
      ws.send(
        JSON.stringify({
          cmd,
          data,
        })
      )
    );
  }

  installExtension(client) {
    const manifest = getManifest();
    const zip = getUCDEXT();
    const d = {
      id: manifest.id,
      content: zip.toBuffer(),
    };
    if (client) {
      this.sendDebugCommand(client, 'rebuild', d);
    } else {
      this.sendAllDebugCommand('rebuild', d);
    }
  }
}

const debugServer = new DebugServer(process.env.DEBUG_SERVER_PORT);

module.exports = {
  debugServer,
};
