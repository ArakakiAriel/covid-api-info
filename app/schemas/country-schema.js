const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

//Declaramos un esquema
let Schema = mongoose.Schema;
//Dentro del esquema declaramos qué campos va a tener el país
let countrySchema = new Schema({
    country:{
        type: String,
        unique: true
    },
    latitude:{
        type: Double,
    },
    longitude:{
        type: Double,
    },
    total_confirmed:{
        type: Number,
        default: 0
    },
    total_deaths:{
        type: Number,
        default: 0
    },
    total_recovered:{
        type: Double,
        default: 0
    },
    total_active_cases:{
        type: Number,
        default: 0
    },
    last_update:{
        type: Object
    },

},
{ autoIndex: false, versionKey: false });

//Utilizando esta funcion podemos quitar el password del json enviado como respuesta para que no se muestre
countrySchema.methods.toJSON = function () {
    delete this._doc._id

    return this._doc;
}

//De esta manera estamos utilizando el countrySchema con el alias country una vez exportado
module.exports = countrySchema;