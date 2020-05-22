const camelCase = require('lodash/camelCase');

function getMiddlewares(middlewareNames) {
  const arrayOfMiddleware = [];
  middlewareNames.forEach((name) => {
    if(typeof(name) === typeof({})){
      for(let i = 0; i < name.repeat; i++){
          name.array.forEach((midName) => {
              const middleware =  typeof midName === 'string' ? require(`./../middlewares/${midName}`)[camelCase(midName)] : midName; // eslint-disable-line
              arrayOfMiddleware.push(middleware);
          })
      }
    }else{
      const middleware =  typeof name === 'string' ? require(`./../middlewares/${name}`)[camelCase(name)] : name; // eslint-disable-line
      arrayOfMiddleware.push(middleware);
    }
  });
  return arrayOfMiddleware;
}

module.exports.getMiddlewares = getMiddlewares;
