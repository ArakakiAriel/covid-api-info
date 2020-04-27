const Redis = require('ioredis');
const config = require('../../config/config');
const messages = require('../../constants/messages');

let redisConnection = null;
let state = null;

const Conn = {
  getConnection: async () => {
    try {
      if (state) {
        return redisConnection;
      }
      throw new Error(messages.REDIS_CONNECTION_ERROR);
    } catch (e) {
      throw e;
    }
  },
  checkInitConnection: () => {
    console.log(`Checking init connection to redis at ${config.redisConfig.server} at port ${config.redisConfig.port} using DB number ${config.redisConfig.dbNumber}`);
    Conn.createConnection();
    return new Promise((resolve, reject) => {
      redisConnection.on('connect', () => {
        console.debug(messages.REDIS_CONNECTION_OK);
        state = true;
        resolve(messages.RESPONSE_OK_STATUS_MESSAGE);
      });
      redisConnection.on('error', (err) => {
        console.error(messages.REDIS_CONNECTION_ERROR, err);
        state = false;
        reject(err);
      });
      redisConnection.on('ready', () => {
        console.info(messages.REDIS_CONNECTION_READY);
        state = true;
      });
    });
  },
  createConnection: () => {
    if (!redisConnection) {
      const connectionParams = {
        port: config.redisConfig.port,
        host: config.redisConfig.server,
        password: config.redisConfig.pass,
        retryStraty(times) {
          return Math.min(times * 50, 2000);
        },
        db: config.redisConfig.dbNumber
      };
      if (config.redisConfig.tls) {
        connectionParams.tls = { };
      }
      redisConnection = new Redis(connectionParams);
    }
  },
  setConnection: (value) => {
    redisConnection = value;
  },
  setState: (value) => {
    state = value;
  }
};

module.exports = Conn;
