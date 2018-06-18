var user = require('../models/user_model.js'),
	path = require('path'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	person = require(path.join(__dirname, '../models/person_model.js'));
	test_helper = {};

test_helper.insertMainUser = function(){
	user.create('rol', 'dnalor', function(){
		return
	})
}

test_helper.insertPerson = function(data){
	person.create(data, function(){
		return
	})
}

test_helper.deletePerson = function(data){
	dbConn.query('delete from people where name = ' + data.name, function(){
		return
	})
}


/*
test_helper.insertMainPerson = function(){
	person.create({name: 'Dummy', dob: 20, dod: 100, bio: 'helped ruh tests', location: 'cyberspace', role: 'philosopher'}, function(){
		return
	})
}

test_helper.insertEvent = function(){
	event.create({name: 'creation of ruh', date: 2018, location: 'cyberspace', description: 'the post-ruh era began'}, function(){
		return
	})
}
*/

module.exports = test_helper;