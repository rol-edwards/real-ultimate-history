
var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://ruhuser@localhost:5432/ruh');
AppError = require(__dirname + '/app_error.js');


 module.exports = {
 	query: function(text) {
 		console.log('dbConn - ' + text);
 		return db.query(text)
 		.catch(function(err){
 			console.log('Heres the new DB error handling in action!');
 			return new AppError(500, 'DB query error');
 		});
 	}
 };