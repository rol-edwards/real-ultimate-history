var express = require('express'),
	path = require('path'),
	person = require(path.join(__dirname, '../models/person_model.js')),
	event = require(path.join(__dirname, '../models/event_model.js')),
	bodyParser = require('body-parser'),
	gatekeeper = require('../gatekeeper.js'),
	router = new express.Router();


router.route('/people_events')
.post(gatekeeper, bodyParser.json(), function(req, res, next){
	var input = {};
	input.person_id = req.body.person_id;
	input.event_id = req.body.event_id;
	input.role = req.body.role;
	person.addEvents(input, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	});
})

router.route('/people_events')
.get(function(req, res, next) {
	var query = {};
	query.id = req.query.id;
	if (req.query.table == 'events'){
		person.findEvents(query.id, function(data){
			
			if (data instanceof AppError) {
			console.log('An error was thrown');
			next(data);
		}
		else res.json(data);
		});
	}
	else {
		event.findPeople(query.id, function(data){
			if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
		})
	}
});

router.route('/people_events')
.delete(function(req, res, next){
	if (req.query.table == 'events'){
		person.deleteEvents(req.query.id, function(data){
			if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);

		});
	}
	else {
		event.deletePeople(req.query.id, function(data){
			if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
		});
	}
})


router.route('/add-people')
.post(gatekeeper, bodyParser.json(), function(req, res, next){
	input = req.body;
	event.addPeople(input, function(data){
		if (data instanceof AppError) {
			next(data);
		}
		else res.json(data);
	})
})

module.exports = router;