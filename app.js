const colors = require('colors');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dateUtil = require('./app/utils/date-util');

const config = require('./app/config/config'); //Archivo de configuraciones, de esta forma se levanta automáticamente y lo corre

const app = express();
const databaseRoute = require('./app/routes/database-route');
const infoRoute = require('./app/routes/info-route');

global.globalDate = dateUtil.getFullDate();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //Middleware cuando es app.use
// parse application/json
app.use(bodyParser.json());

//Configuracion globar de rutas
//app.use(require('./routes/index'));


const mongoOptions = {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true 
}
mongoose.connect(process.env.URLDB, mongoOptions);
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
        mongoose.connect(process.env.URLDB, mongoOptions);
      }, config.mongo.reconnection_interval);
    }
});


// covid routing
//app.use(`/api/covid/database`, databaseRoute);
app.use(`/api/covid/info`, infoRoute);



app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT);
});


(() => {
    // if one of the dependencies does not response the ms can not start
    require('./app/services/redis/init-redis-connection'); // eslint-disable-line
  })();
  