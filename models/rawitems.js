var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rawitemsSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    quantity: {
        type:Number,
        required:true,
    },
    city: {
        type:String,
        required:true,
    },
    state: {
        type:String,
        required:true,
    },
    postedby : {
        type : String,
        required : true
    },
    requeststatus : {
        type : Boolean,
        default : false,
        required : true
    },
    acceptedby : {
        type : String,
        default : 'none'
    }
});

module.exports = mongoose.model('Rawitems',rawitemsSchema);


