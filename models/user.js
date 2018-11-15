var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
mongoose.set('useCreateIndex',true);

var nameValidator = [

    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name should have minimum 3 and maximum 20 characters separated by space and should not have any special characters or numbers',

    }),

    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
];

var usernameValidator = [

    validate({
        validator: 'isAlphanumeric',
        message: 'Username should contain only alphabets and numbers',

    }),

    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]).{8,25}$/,
        message : 'Password must have one lowercase, one uppercase, one special character, one number and minimum 8 and maximum 25 character'
    }),

    validate({
        validator: 'isLength',
        arguments: [8, 25],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
];

var emailValidator = [

    validate({
        validator: 'isEmail',
        message: 'Is not a valid e-mail',

    }),

    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'E-mail should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
];

var userSchema = new Schema( {
    name: {
        type:String,
		required:true,
		validate:nameValidator,
    },
	username: {
		type:String,
		unique:true,
        required:true,
		validate:usernameValidator,
	},
	password: {
		type:String,
        required:true,
        validate:passwordValidator,
        select:false,
	},
	email: {
		type:String,
		unique:true,
        required:true,
        validate:emailValidator
	},
    role : {
        type : String,
        required : true
    },
    institute : {
        type : String,
        required : true
    },
    cart : [{
        itemid : String,
        count : Number,
        name : String,
        price : Number,
        tag : String
    }],
	active: {
        type: Boolean,
        default: false,
        required: true
    },
	temporarytoken: {
		type:String,
		required:true
	}
});

userSchema.pre('save', function(next) 
{
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password,null,null,function(err,hash) {
	if(err)
	{
		console.log("Password not encrypted");
	}
	else
	{
		console.log("Password encrypted");
	}
	user.password = hash;
	next();
	});
});

userSchema.plugin(titlize, {
    paths: [ 'name'], // Array of paths
});

userSchema.methods.comparepassword=function(password){
	return bcrypt.compareSync(password,this.password);
};




module.exports = mongoose.model('User',userSchema);


