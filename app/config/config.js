
//===============
//    Puerto
//===============
process.env.PORT = process.env.PORT || 3000;


//===============
//    Entorno
//===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=========================
//  Google Client ID
//========================
process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials/credentialAccess.json';

//===============
//   DataBase
// Acá vamos a encontrar como configurar nuestra base de datos creada en MongoDB Atlas para poder almacenar allí la información
//===============
let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27018/covid'
}else{
    urlDB = 'mongodb+srv://kenjiman:p9YxtOCvGmOobqaJ@llevomiscuentasdb-2xdud.mongodb.net/covid'
}

process.env.URLDB = urlDB;

module.exports = {
    mongo: {
      reconnection_interval: process.env.MONGO_RECONNECTION_INTERVAL || 3000
    }
};
  