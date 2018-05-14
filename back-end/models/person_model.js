var path = require('path'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	fs = require('fs'),
	person = {};


person.find = function(query, callback){
	console.log('person_model: finding people');
	var whereString = '';
	var orderString = ' dob asc';
	if (Object.keys(query).length != 0){
		whereString = queryWriter.where(query);
		console.log('whereString is: ' + whereString + ', query is ' + Object.keys(query))
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

person.getByName = function(name, callback){
	console.log('person_model: getting person by name')
	dbConn.query('select * from people where lower(name) like lower(' +  '\'' + name + '%\')').then(callback)
  	
};

person.findById = function(id, callback) {
	console.log('finding person router working');
	dbConn.query('select * from people where id =' + id).then(callback)
};

person.create = function(input, callback) {
	console.log('create model activated');
	queryString = queryWriter.create(input, 'people');
	dbConn.query(queryString).then(callback)
};

person.update = function(input, id, callback){
	console.log('update model activated');
	queryString = queryWriter.update(input, 'people', id);
	dbConn.query(queryString).then(callback)
};

person.delete = function(id, callback){
	console.log('person_model: deleting person')
	dbConn.query('delete from people where id = ' + id + ' returning *')
	.then(function(err, data){
		fs.unlink(path.join(__dirname, '../../front-end/images/' + id + '.jpg'), 
		function(err, data){
			if (err) {
				console.log('error')
				return callback(data)
			}
			console.log('image deleted');
			callback(data);
		});
	})
	//how to indent here?
};

person.deleteEvents = function(id, callback){
	console.log('person_model: delete events reached')
	dbConn.query('delete from people_events where person_id = ' + id)
	.then(callback)
};

person.findEvents = function (id, callback) {
	console.log('model finding events for person');
	dbConn.query('select e.name, e.id, e.date, pe.role from events e inner join people_events pe on e.id = pe.event_id where pe.person_id =' + id + ' order by e.date').then(callback)
};

person.addEvents = function(input, callback){
	console.log('person_model:> add events model reached');
	queryString = queryWriter.create(input, 'people_events')
	dbConn.query(queryString).then(callback)
};

 person.count = function(callback){
  	dbConn.query('select count (name) from people').then(callback)
 };


module.exports = person;
