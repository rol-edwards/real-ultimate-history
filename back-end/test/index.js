var path = require('path'),
	test_helper = require('./test_helper.js'),
	dbConn = require(path.join(__dirname, '../dbConn.js')),
	queryWriter = require(path.join(__dirname, '../query_writer.js')),
	app = require(path.join(__dirname, '../app.js'));
	request = require('supertest'),
	person = require(path.join(__dirname, '../models/person_model.js')),
	assert = require('chai').assert;


	var newPerson = {
			name: 'China_guy',
			dob: 101,
			dod: 200,
			bio: 'was Chinese, missed the great event of AD100',
			nation: 'China',
			role: 'philosopher'
		}

		var otherPerson = {
			name: 'Euro_guy',
			dob: 50,
			dod: 150,
			bio: 'proud participant of AD 100 thing',
			nation: 'France',
			role: 'military'
		}


describe('the people routes', function(){
	/*Let's try creating a new user. We'll need to input the username and password. The test should work if they are valid*/
	
	before(function(done){//get everything ready)
	//create people alive and not alive in 100AD.
	
	//create user, login and out before/after each

		test_helper.insertPerson(newPerson);
		test_helper.insertPerson(otherPerson);
		done();

	});	

	/*after(function(done){
		test_helper.deletePerson(newPerson);
		test_helper.deletePerson(otherPerson);
		done();
	})*/

	describe('GET routes', function(){
		it('should return an array of length 12', function(done){
			request(app)
			.get('/api/people/?number=12')
			.end(function(err, res){
				assert.equal(res.body.length, 12)
				done();
			})
		})
		it('should not return a person not alive at given date', function(done){
			request(app)
			.get('/api/people/?date=100')
			.end(function(err, res){
				assert.isBelow(res.body[0].dob, 100)
				done();
			})
		})
		it('should return people from a given country', function(done){
			request(app)
			.get('/api/people/?nation=China')
			.end(function(err, res){

				assert.equal(res.body[0].nation, 'China')
				done();
			})
			
		})
		it('should not return people from other countries', function(done){
			request(app)
			.get('/api/people/?nation=China')
			.end(function(err, res){
				other_countries = [];
				res.body.forEach(function(record){
					if (record.nation != 'China'){
						other_countries.push(record.nation)
					}
				})
				assert.equal(other_countries.length, 0)
				done();
			})
			
		})

	})
	
})

