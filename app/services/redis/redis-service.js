const redisClient = require('./redis-connection');

module.exports = function () {
  this.setData = (id, info, ttl) => {
    return new Promise(async (resolve, reject) => {
      try {
        const client = await redisClient.getConnection();
        client.set(id, info, (err) => {
          if (err) {
            reject(err);
          }
          if (ttl !== 0 && ttl !== null && ttl !== undefined) {
            client.expire(id, ttl);
          }
          resolve(id);
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  this.getData = (id) => {
    return new Promise(async (resolve, reject) => {
      const client = await redisClient.getConnection();
      client.get(id, (err, value) => {
        if (err) {
          reject(err);
        }
        resolve(value);
      });
    });
  };

  this.deleteData = (id) => {
    return new Promise(async (resolve, reject) => {
      const client = await redisClient.getConnection();
      client.del(id, (err, value) => {
        if (err) {
          reject(err);
        }
        resolve(value);
      });
    });
  };
};
