var user = require('../models/user_model.js'),
	path = require('path'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	person = require(path.join(__dirname, '../models/person_model.js'));
	test_helper = {};


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


module.exports = test_helper;