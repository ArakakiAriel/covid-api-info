const colors = require('colors');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

require('./app/config/config'); //Archivo de configuraciones, de esta forma se levanta automáticamente y lo corre

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //Middleware cuando es app.use
// parse application/json
app.use(bodyParser.json());

//Configuracion globar de rutas
//app.use(require('./routes/info'));

mongoose.connect(process.env.URLDB,
        {useNewUrlParser:true, useCreateIndex:true}, //Configuraciones a la hora de hacer la conexion a mongo
        (err, res) => {
    if(err) throw err;

    console.log('Database: ' + 'ONLINE'.green);

});
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);


app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT);
});