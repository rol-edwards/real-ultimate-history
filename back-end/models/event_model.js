var path = require('path'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	event = {};


event.find = function(query, callback) {
	console.log('event_model: find function reached')
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
	console.log('event_model: getting person by name')
	dbConn.query('select * from events where lower(name) like lower(' +  '\'' + name + '%\') or lower(name) like lower(\'% of ' + name + '%\')').then(callback)
};

event.findById = function(id, callback) {
	console.log('finding event model working');
	dbConn.query('select * from events where id =' + id).then(callback)
};



event.create = function(input, callback){
	console.log('event create model initiated');
	queryString = queryWriter.create(input, 'events');
	dbConn.query(queryString).then(callback)
};

event.update = function(input, id, callback){
	console.log('edit event model working');
	queryString = queryWriter.update(input, 'events', id);
	dbConn.query(queryString).then(callback)
};

event.delete = function(id, callback){
	console.log('event_model: deleting person')
	dbConn.query('delete from events where id = ' + id + ' returning *')
};

event.findPeople = function (id, callback) {
	console.log('event_model: finding people for event');
	dbConn.query('select p.name, p.id, p.dob, p.dod, pe.role from people p inner join people_events pe on p.id = pe.person_id where pe.event_id =' + id).then(callback)
};

event.addPeople = function(input, callback){
	console.log('event_model: creating person')
	queryString = queryWriter.create(input, 'people_events');
	dbConn.query(queryString).then(callback)
};

event.deletePeople = function(id, callback){
	console.log('event_model: clearing prior associated people')
	dbConn.query('delete from people_events where event_id = ' + id).then(callback)
};


module.exports = event;
