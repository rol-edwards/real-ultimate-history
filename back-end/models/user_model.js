var path = require('path'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	bcrypt = require('bcrypt'),
	user = {};


user.findByUsername = function(username, callback){
	dbConn.query('select * from users where username = \'' + username + '\'')
	.then(callback).catch(function(error){
		console.log('error: ' + error)
		callback(null)
	});
};

user.authenticate = function(password, data, callback){
	loginAttempts = data.loginattempts;
	if (loginAttempts > 3){
		console.log('you have been locked out!')
	}
	else {
		bcrypt.compare(password, data.password, function(err, res){
			if (res){
				user.update(data.id, {loginAttempts: 0})
				callback({pw: true, loginAttempts: 0})
			}
			else {
				user.update(data.id, {loginAttempts: loginAttempts + 1})
				callback({pw: false, loginAttempts: 2 - loginAttempts})
			};
		});
	};
};

user.update = function(id, data, callback){
	queryString = queryWriter.update(data, 'users', id);
	dbConn.query(queryString).then(callback)
	.catch(function(error){
		console.log('error: ' + error)
		callback(null)
	});
};

//this is a duplicate?
user.isUsernameTaken = function(username, callback){
	console.log('model looking for username')
	dbConn.query('select * from users where username = \'' + username + '\'')
	.then(callback).catch(function(error){
		console.log('error: ' + error);
	});
};

user.create = function(username, password, callback){
	console.log('user_models: create model reached')
	bcrypt.hash(password, 10, function(err, hash){
		console.log('user_models: bcrypt reached')
		if (err) return next(err);
		password = hash;
		dbConn.query(queryWriter.create({username: username, password: password, loginAttempts: 0}, 'users'))
		.then(callback).catch(function(error){
			console.log('error: ' + error)
		});
	});
};

user.findById = function(id, callback){
	dbConn.query('select * from users where id = ' + id)
	.then(callback).catch(function(error){
		console.log('error: ' + error)
	});
};

module.exports = user;