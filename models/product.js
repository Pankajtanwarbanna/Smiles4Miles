var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema( {
    name: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true,
    },
    quantity: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Product',productSchema);
