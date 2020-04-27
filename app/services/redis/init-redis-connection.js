const c = require('./redis-connection');

(() => {
  c.checkInitConnection()
    .then(() => {
      // eslint-disable-next-line no-console
      console.info('connected to Redis');
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.info('err', e);
      process.exit(1);
    });
})();
