var path = require('path'),
	express = require('express'),
	AppError = require(__dirname + '/app_error.js'),
	cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require(__dirname + '/config.js'),
    fileUpload = require('express-fileupload');


var app = express();

app.use(express.static(path.join(__dirname, '../front-end')));

app.use(fileUpload());

app.use(cookieParser(config.cookieSecret));
app.use(session({secret:config.cookieSecret, saveUninitialized:false, resave:false})); 

app.use('/api', require(__dirname + '/routes/person_routes.js'));
app.use('/api', require(__dirname + '/routes/people_events_routes.js'));
app.use('/api', require(__dirname + '/routes/event_routes.js'));
app.use('/api', require(__dirname + '/routes/user_routes.js'));


app.use(function(err, req, res, next){
	if (err instanceof AppError) {
		res.status(err.statusCode).send(err.message); 
	}
	else {
		res.status(500).send("Internal server error"); 
	}
});


module.exports = app;