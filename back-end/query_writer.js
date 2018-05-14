queryWriter = {};

queryWriter.create = function (data, table) {
	console.log('query being written');
	var fields = Object.keys(data);
	var fieldString = 'insert into ' + table + ' (';
	var valueString ='values (\'';
	fields.forEach(function(field) {
		fieldString += field + ', ';
		valueString += data[field] + '\', \'';
	});
	fieldString = fieldString.slice(0, -2) + ') ';
	valueString = valueString.slice(0, -3) + ')';
	queryString = fieldString + valueString + ' returning id as id';
	console.log(queryString);
	return queryString;
};

//I could adapt this to also accept = or >=? Probably not though, since there aren't too many special cases. 
queryWriter.update = function(data, table, id) {
	fields = Object.keys(data);
	if (fields){
	queryString = 'Update ' + table + ' set ';
	fields.forEach(function(field){
		queryString += field + ' = ' + '\'' + data[field] + '\', ';
	});
	queryString = queryString.slice(0, -2) + ' where id =' + id;
	return queryString;
	}	
};

queryWriter.where = function(data, table) {
	var fields = Object.keys(data);
	queryString = 'where ';
	fields.forEach(function(field){
		if (data[field]){
			queryString += field + ' = \'' + data[field] + '\' and ';
		}
	})
	queryString = queryString.slice(0, -4);
	return queryString
};

module.exports = queryWriter;