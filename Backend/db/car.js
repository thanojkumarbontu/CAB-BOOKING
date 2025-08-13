const mongoose = require('mongoose');

const carschema = new mongoose.Schema({

drivername: String,

carImage: String,

carname: String,

cartype: String,

price:String,

carno: {

type: String

},


})

module.exports =mongoose.model('car', carschema)