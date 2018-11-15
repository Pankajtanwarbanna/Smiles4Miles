var express    = require('express');
var app        = express();
var port       = process.env.PORT || 8000;
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var router     = express.Router();
var appRoutes  = require('./routes/api.js')(router);
var path       = require('path');
var multer     = require('multer');
var passport   = require('passport');
var social     = require('./passport/passport.js')(app,passport);

app.use(morgan('dev'));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(__dirname + '/public'));

app.use('/api',appRoutes);

app.get('*',function(req,res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

mongoose.connect('mongodb://localhost:27017/smilesformiles', { useNewUrlParser: true },function(err){
	if(err){
		console.log('Not connected to the database ');
	} else {
		console.log('Connected successfully');
	}
});

app.listen(port,function() {
	console.log("Running the server on port " + port);
});

