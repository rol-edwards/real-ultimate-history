var path = require('path'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	fs = require('fs'),
	event = {};


event.find = function(query, callback) {
	var whereString = '';
  	var orderString = ' date asc';
	if (Object.keys(query).length != 0){
  		whereString = queryWriter.where(query);
  	}
  	if (query.number){
  		whereString = '';
  		orderString = ' random() limit ' + query.number;
  	}
  	if (query.dob){
  		whereString = 'where date >= ' + query.dob + 'and date <= ' + query.dod;
  	}
	dbConn.query('select * from events ' + whereString + ' order by' + orderString).then(callback)
};

//separated from above to make search function more efficient
event.getByName = function(name, callback){
	dbConn.query('select * from events where lower(name) like lower(' +  '\'' + name + '%\') or lower(name) like lower(\'% of ' + name + '%\')').then(callback)
};

event.findById = function(id, callback) {
	dbConn.query('select * from events where id =' + id).then(callback)
};



event.create = function(input, callback){
	queryString = queryWriter.create(input, 'events');
	dbConn.query(queryString).then(callback)
};

event.update = function(input, id, callback){
	queryString = queryWriter.update(input, 'events', id);
	dbConn.query(queryString).then(callback)
};

event.delete = function(id, callback){
	dbConn.query('delete from events where id = ' + id + ' returning *')
	.then(function(err, data){
		fs.unlink(path.join(__dirname, '../../front-end/images/event' + id + '.jpg'), 
		function(err, data){
			if (err) {
				return callback(data)
			}
			callback(data);
		});
	})
};

event.findPeople = function (id, callback) {
	dbConn.query('select p.name, p.id, p.dob, p.dod, pe.role from people p inner join people_events pe on p.id = pe.person_id where pe.event_id =' + id).then(callback)
};

event.addPeople = function(input, callback){
	queryString = queryWriter.create(input, 'people_events');
	dbConn.query(queryString).then(callback)
};

event.deletePeople = function(id, callback){
	dbConn.query('delete from people_events where event_id = ' + id).then(callback)
};


module.exports = event;
