var path = require('path'),
	AppError = require(path.join(__dirname, './app_error.js')); 

var gatekeeper = function(req, res, next){
	console.log('gatekeeper reached')
	if (!(req.session.hasOwnProperty('userId'))) next(new AppError(401, "LoggedIn")); 
	else next();
};

module.exports = gatekeeper;