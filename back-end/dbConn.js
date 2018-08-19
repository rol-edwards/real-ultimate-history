
var pgp = require('pg-promise')(/*options*/)
AppError = require(__dirname + '/app_error.js');
config = require(__dirname + '/config.js');

var username = config.username,
	password = config.password,
	database = config.database


var db = pgp('postgres://' + username + ':' + password + '@localhost:5432/' + database);


module.exports = {
 	query: function(text) {
 		return db.query(text)
 	
 		.catch(function(err){
 			console.log('Heres the new DB error handling in action!');
 			return new AppError(500, 'DB query error');
 		});
 	}
};