var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cookedfoodSchema = new Schema( {
    meal: {
        type:String,
        required:true
    },
    people: {
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

module.exports = mongoose.model('Cookedfood',cookedfoodSchema);
