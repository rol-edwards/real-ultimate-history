var path = require('path'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	fs = require('fs'),
	person = {};


person.find = function(query, callback){
	var whereString = '';
	var orderString = ' dob asc';
	if (Object.keys(query).length != 0){
		whereString = queryWriter.where(query);
	};
	if (query.number){
		orderString = ' random() limit ' + query.number;
		whereString = '';
	};
	if(query.date){
		whereString = 'where dob <= ' + query.date + ' and dod >=' + query.date;
	}
	dbConn.query('select * from people ' + whereString + 'order by' + orderString).then(callback);
};

//separated from above to keep search function efficient
person.getByName = function(name, callback){
	dbConn.query('select * from people where lower(name) like lower(' +  '\'' + name + '%\')').then(callback)	
};

person.findById = function(id, callback) {
	dbConn.query('select * from people where id =' + id).then(callback)
};

person.create = function(input, callback) {
	queryString = queryWriter.create(input, 'people');
	dbConn.query(queryString).then(callback)
};

person.update = function(input, id, callback){
	queryString = queryWriter.update(input, 'people', id);
	dbConn.query(queryString).then(callback)
};

person.delete = function(id, callback){
	dbConn.query('delete from people where id = ' + id + ' returning *')
	.then(function(err, data){
		fs.unlink(path.join(__dirname, '../../front-end/images/' + id + '.jpg'), 
		function(err, data){
			if (err) {
				return callback(data)
			}
			callback(data);
		});
	})
	//how to indent here?
};

person.findEvents = function (id, callback) {
	dbConn.query('select e.name, e.id, e.date, pe.role from events e inner join people_events pe on e.id = pe.event_id where pe.person_id =' + id + ' order by e.date').then(callback)
};

person.addEvents = function(input, callback){
	queryString = queryWriter.create(input, 'people_events')
	dbConn.query(queryString).then(callback)
};

person.deleteEvents = function(id, callback){
	dbConn.query('delete from people_events where person_id = ' + id)
	.then(callback)
};

//incorporate into search, for pagination in case database gets big?
 person.count = function(callback){
  	dbConn.query('select count (name) from people').then(callback)
 };


module.exports = person;
