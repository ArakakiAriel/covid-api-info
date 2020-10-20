const colors = require('colors');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dateUtil = require('./app/utils/date-util');
const constants = require('./app/constants/constants');
const messages = require('./app/constants/messages');


const config = require('./app/config/config'); //Archivo de configuraciones, de esta forma se levanta automáticamente y lo corre

const app = express();
//const databaseRoute = require('./app/routes/database-route');
const casesRoute = require('./app/routes/cases-route');
const countryCasesRoute = require('./app/routes/country-cases-route');

global.todaysDate = dateUtil.getFullDate();
global.globalDate = todaysDate;
global.globalCollectionName = `results-${dateUtil.formatCertainDate(globalDate)}`;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //Middleware cuando es app.use
// parse application/json
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//Configuracion globar de rutas
//app.use(require('./routes/index'));


const mongoOptions = {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true 
}
if(config.mongo.needConnection){
  mongoose.connect(config.mongo.urlDB, mongoOptions);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  
  
  mongoose.connection.on('connected', () => {
      console.log('MONGO CONNNECTED'.green);
    });
    
  mongoose.connection.on('disconnected', () => {
      console.log('MONGO DISCONNECTED'.red);
      if (mongoose.connection.readyState === 0) {
        mongoose.connection.readyState = 2;
        setTimeout(() => {
          mongoose.connect(config.mongo.urlDB, mongoOptions);
        }, config.mongo.reconnection_interval);
      }
  });
}


// covid routing
//app.use(`/api/covid/database`, databaseRoute);
app.use(`/api/covid/cases/country`, countryCasesRoute);
app.use(`/api/covid/cases`, casesRoute);
app.get('/healthcheck', (req, res) => {
  res.json({ //Mando la respuesta como json
    running: true
  })
});


// 404 - Json formatting for not supported URI
app.use('*', (req, res) => { // eslint-disable-line
  res.setHeader('Content-Type', 'application/json');
  // eslint-disable-next-line max-len
  res.status(constants.NOT_FOUND_ERROR).send({ code: constants.NOT_FOUND_ERROR, message: messages.INVALID_URL });
});

//TIMEOUT
app.use((err, req, res, next) => { // eslint-disable-line
  // eslint-disable-next-line max-len
  if (req.timedout) {
    res.status(constants.REQUEST_TIMEOUT).send({
      code: messages.RESPONSE_NOK_STATUS_MESSAGE,
      message: messages.REQUEST_TIMEOUT
    });
  } else {
    res.status(constants.INTERNAL_ERROR).send({
      code: constants.INTERNAL_ERROR,
      message: messages.NOT_HANDLED_ERROR
    });
  }
});

app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT);
});


(() => {
    // if one of the dependencies does not response the ms can not start
    require('./app/services/redis/init-redis-connection'); // eslint-disable-line
  })();
  